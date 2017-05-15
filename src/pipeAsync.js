// @flow

// pipeAsync :: Async Function -> Opts {} -> TransformBlueprint
// pipeAsync takes an async function and wraps it into
// a transform streams. Waits till completion, before enqueuing.
//
// Returns a blueprint class that can be used to
// instantiate above streams.
//

import type {
  Transformer,
  TransformInterface,
  ReadableStrategy,
  WritableStrategy,
  ReadableStreamController,
  WritableStreamWriter
} from "./streams";

import type { asyncFn } from "./utils";

import { TransformStream } from "./streams";

export default function pipeAsync ( fn: asyncFn, {
    init, readableStrategy, writableStrategy
  }: {
  // opts
    init: ?mixed,
    readableStrategy: ?ReadableStrategy,
    writableStrategy: ?WritableStrategy
  }={} ): TransformInterface {

  // Prepare transformer
  let transformer: Transformer = {
    // Store awaiting functions
    _unfulfilledFutures: [],

    // Run function and enqueue result
    transform ( chunk: mixed, controller: ReadableStreamController ): ?Promise<mixed> {
      // Run async fn
      let
        future = fn( chunk ),
        condEnqueue = v => {
          if ( v !== void 0 )
            controller.enqueue( v );
        },

        // Get index of current future
        findex: number = transformer._unfulfilledFutures.length;

      // Add to executing futures list
      transformer._unfulfilledFutures.push( future );

      // Proceed to enqueue
      future
        .then( condEnqueue, () => {
          // Signal error to stream
          throw new Error
        })

        // Remove itself from the _unfulfilledFutures list
        .then( () => transformer._unfulfilledFutures.splice( findex, 1 ) );

      return future;
    },

    flush ( controller ) {
      let condEnqueue = v => {
        if ( v !== void 0 )
          controller.enqueue( v );
      };

      // Check if anything is left
      Promise.all( transformer._unfulfilledFutures )
        .then( (vs: Array<mixed>) => vs.map( condEnqueue ));
    },

    // if passed
    readableStrategy,
    writableStrategy
  };

  // Wrap in blueprint class
  class TransformBlueprint extends TransformStream implements TransformInterface {
    constructor () {
      // Make stream
      let
        stream: TransformStream = super( transformer ),
        writer: WritableStreamWriter;

      // If init, push chunk
      if ( init !== void 0 ) {
        writer = stream.writable.getWriter();
        writer.write( init );

        // Release lock so other writers can start writing
        writer.releaseLock();
      }


      return stream;
    }
  }

  // Return Transform blueprint if not instance
  if ( this instanceof pipeAsync )
    return new TransformBlueprint;

  else
    return TransformBlueprint;

}
