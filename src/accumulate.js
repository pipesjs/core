// accumulate :: Function -> InitValue -> { readable, writable }
// accumulate function takes a reducer function,
// and an optional inital value.
//
// Returns a readable, writable pair that consumes piped
// stream, combining the values with the reducer
// and enqueues the result.
//
// reducer :: PrevValue -> CurrValue -> NextValue
// reducer function gets:
//
// PrevValue: the previous value or InitValue (if supplied)
// CurrValue: the current value being processed.
//
// that returns NextValue which in turn becomes PrevValue
// for the next iteration until the input stream is
// entirely consumed.
//

import { ReadableStream, WritableStream } from "./streams";
import { isFunction } from "./utils";

const
  compatibilityError = `
    accumulate takes a reducing function
  `;

export default function accumulate(reducer, init) {
  // check if reducer is a function
  if ( !isFunction( reducer ))
    throw new Error( compatibilityError );

  class ReadableWritable {
    constructor() {

      // Init
      let
        result = init,
        readable, writable,
        done, resolved, rejected,
        cancelled;

      // Create done promise
      done = new Promise( ( resolve, reject ) => {
        resolved = resolve;
        rejected = reject;
      });

      // writable
      writable = new WritableStream({
        start( err ) {
          // Reject if error
          done.catch( rejected );
        },

        write( chunk ) {
          // if init not passed, set result as chunk
          if ( result === void 0 ) {
            result = chunk;
            return;
          }

          // else, reduce and set result
          result = reducer( result, chunk );
        },

        close() {
          resolved( result );
        },

        abort: rejected
      });

      // readable
      readable = new ReadableStream({
        start( controller ) {

          // Chain enqueue and done
          let finished = done.then(
            // Enqueue value if stream not cancelled
            val => {
              if ( !cancelled )
                controller.enqueue( val );
            },
            controller.error.bind( controller )
          );

          // Close when finished
          finished.then( controller.close.bind( controller ));
        },
        cancel( reason ) {
          // Set flag
          cancelled = true;

          // Close writable
          writable.close();

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

  // Return ReadableWritable blueprint
  return ReadableWritable;

}

// Browserify compat
if ( typeof module !== "undefined" )
  module.exports = accumulate;

