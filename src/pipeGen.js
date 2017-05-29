// @flow

// pipeGen :: Generator Function -> Opts {} -> ReadableWritableBlueprint
// pipeGen takes a generator function and wraps it into
// a transform streams. Waits till completion, before enqueuing.
// All yields are enqueued, back-pressure is respected and
// the generator paused if queue getting back-pressured.
//
// Returns a blueprint class that can be used to
// instantiate above streams.
//

import type { anyFn } from "./utils";

import type {
  Transformer,
  TransformInterface,
  ReadableStrategy,
  WritableStrategy,
  ReadableStreamController,
  WritableStreamWriter
} from "./streams";

import { ReadableStream, WritableStream } from "./streams";
import { EOS, uuid, events, isFunction } from "./utils";

const
  readyEvt: string = uuid(),
  closedProp: string = uuid();

// Pump function that runs the generator and adds produced values
// to the transform stream.
function pump (
    gen: Generator<any, any, any>,
    controller: ReadableStreamController,
    resolve: ?anyFn ): ?mixed {

  // Clear queue
  events.off( readyEvt );

  // Check stream state
  let backpressure: boolean = controller.desiredSize <= 0;

  // Wait for backpressure to ease
  if ( backpressure ) {
    return events.on( readyEvt, () => {
      pump( gen, controller, resolve );
    });
  }

  // Ready? proceed
  let
    // Check readable status
    step = controller[closedProp] ? gen.return(true) : gen.next(false),
    { done, value } = step;

  // Check for EOS and enqueue
  if ( value === EOS ) {
    controller.close();
    done = true;

  } else {
    // Enqueue
    controller.enqueue( value );
  }

  // Generator exhausted? resolve promise
  if ( done ) {
    return resolve && resolve();
  }

  // Else rinse, repeat
  return pump( gen, controller, resolve );
}

export default function pipeGen ( fn: (mixed) => Generator<any,any,any>, {
    init, readableStrategy, writableStrategy
  }: {
  // opts
    init: ?mixed,
    readableStrategy: ?ReadableStrategy,
    writableStrategy: ?WritableStrategy
  }={} ) {

  return class ReadableWritableBlueprint implements TransformInterface {
    readable: ReadableStream
    writable: WritableStream

    constructor() {

      // Init
      let
        readable: ReadableStream,
        writable: WritableStream,
        readableReady: Promise<?mixed>,
        readableReady_resolve: anyFn,
        readableController: ReadableStreamController;

      // create promise that awaits both streams to start
      readableReady = new Promise( resolve => {
        readableReady_resolve = resolve;
      });


      // writable
      writable = new WritableStream({
        start() {
          return readableReady;
        },

        write( chunk, controller ) {
          let promise: Promise<?mixed>, _resolve: ?anyFn;

          promise = new Promise( resolve => {
            _resolve = resolve;
          });

          // Start pump
          let gen = fn( chunk );
          pump( gen, readableController, _resolve );

          return promise;
        },

        close() {
          // Close readable stream
          try {
            readableController.close();

          } catch (e) {
            if ( e instanceof TypeError ) {
              // Oops, closed already. Ignore
            } else {
              throw e;
            }

          } finally {
            // Signal generator to stop
            readableController[closedProp] = true;
          }
        }
      }, writableStrategy );

      // readable
      readable = new ReadableStream({
        start( controller ) {
          readableController = controller;
          readableController[closedProp] = false;

          // Signal writable to start
          readableReady_resolve();
        },

        pull() {
          events.trigger( readyEvt );
        },

        cancel( reason ) {
          // Close writable
          writable._write.close();

          // Tell gen to stop
          readableController[closedProp] = true;
        }
      }, readableStrategy );

      // If init, push chunk
      if ( init !== void 0 ) {
        let writer: WritableStreamWriter = writable.getWriter();
        writer.write( init );

        // Release lock so other writers can start writing
        writer.releaseLock();
      }

      // Return { readable, writable } pair
      this.readable = readable;
      this.writable = writable;
    }
  }
}
