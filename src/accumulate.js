// @flow

import type { ReadableStreamController } from "./streams";
import {
    ReadableStream, WritableStream
} from "./streams";

import { isFunction } from "./utils";

const
  compatibilityError : string = `
    accumulate takes a reducing function
  `;

/**
 * This function takes a reducer function and an optional initial value and
 * returns a transformstream that accumulates the values of any stream piped to it.
 *
 * @param {function} reducer a function that takes sequential values and reduces them
 *
 * @returns {TransformStream} a ReadableWritable that consumes piped
 * stream, combining the values with the reducer and enqueues the result.
 *
 * @example
 * let readable, accumulator, accumulated, total;
 *
 *   // Create streams
 *   readable = createTestReadable( [1,2,3] );
 *
 *   // Connect the streams
 *   accumulator = accumulate( (a, b) => a+b, 4 );
 *   accumulated = readable.pipeThrough( new accumulator );    // 10
 */
export default function accumulate(reducer: (mixed, mixed) => mixed, init: ?mixed) {
  // check if reducer is a function
  if ( !isFunction( reducer ))
    throw new Error( compatibilityError );

  class ReadableWritableBlueprint {
    readable: ReadableStream;
    writable: WritableStream;

    constructor() {

      // Init
      let
        result: ?mixed = init,
        readable: ?ReadableStream, writable: ?WritableStream,
        done: Promise<mixed>, resolved: (mixed) => void, rejected: (mixed) => void,
        cancelled: boolean = false;

      // Create done promise
      done = new Promise( ( resolve, reject ) => {
        resolved = resolve;
        rejected = reject;
      });

      // writable
      writable = new WritableStream({
        start( err: Error ): void {
          // Reject if error
          done.catch( rejected );
        },

        write( chunk: mixed ): void {
          // if init not passed, set result as chunk
          if ( result === void 0 ) {
            result = chunk;
            return;
          }

          // else, reduce and set result
          result = reducer( result, chunk );
        },

        close(): void {
          resolved( result );
        },

        abort: rejected
      });

      // readable
      readable = new ReadableStream({
        start( controller: ReadableStreamController ): void {

          // Chain enqueue and done
          let finished: Promise<mixed> = done.then(
            // Enqueue value if stream not cancelled
            (val: mixed) => {
              if ( !cancelled )
                controller.enqueue( val );
            },
            controller.error.bind( controller )
          );

          // Close when finished
          finished.then( controller.close.bind( controller ));
        },
        cancel( reason: ?string ): void {
          // Set flag
          cancelled = true;

          // Close writable
          writable && writable.close();

          // Resolve promise
          resolved( reason );
        }
      });

      // Return { readable, writable } pair
      Object.assign( this, {
        readable, writable
      });

    }
  }

  // Return ReadableWritable blueprint if not instance
  if ( this instanceof accumulate )
    return new ReadableWritableBlueprint;

  else
    return ReadableWritableBlueprint;

}

// Browserify compat
if ( typeof module !== "undefined" )
  // $FlowFixMe
  module.exports = accumulate;
