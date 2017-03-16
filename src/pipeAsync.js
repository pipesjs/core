// pipeAsync :: Async Function -> Opts {} -> TransformBlueprint
// pipeAsync takes an async function and wraps it into
// a transform streams. Waits till completion, before enqueuing.
//
// Returns a blueprint class that can be used to
// instantiate above streams.
//

import { TransformStream } from "./streams";

export default function pipeAsync ( fn, {
  // opts
    init,
    readableStrategy,
    writableStrategy
  }={} ) {

  // Prepare transformer
  let transformer = {
    // Store awaiting functions
    _unfulfilledFutures: [],

    // Run function and enqueue result
    transform ( chunk, controller ) {
      // Run async fn
      let
        self = transformer,
        future = fn( chunk ),
        condEnqueue = v => {
          if ( v !== void 0 )
            controller.enqueue( v );
        },

        // Get index of current future
        findex = self._unfulfilledFutures.length;

      // Add to executing futures list
      self._unfulfilledFutures.push( future );

      // Proceed to enqueue
      future
        .then( condEnqueue, () => {
          // Signal error to stream
          throw new Error
        })

        // Remove itself from the _unfulfilledFutures list
        .then( () => self._unfulfilledFutures.splice( findex, 1 ) );

      return future;
    },

    flush ( controller ) {
      let self = transformer,
        condEnqueue = v => {
          if ( v !== void 0 )
            controller.enqueue( v );
        };

      // Check if anything is left
      Promise.all( self._unfulfilledFutures )
        .then( vs => vs.map( condEnqueue ));
    },

    // if passed
    readableStrategy,
    writableStrategy
  };

  // Wrap in blueprint class
  class TransformBlueprint extends TransformStream {
    constructor () {
      // Make stream
      let
        stream = super( transformer ),
        writer;

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

// Browserify compat
if ( typeof module !== "undefined" )
  module.exports = pipeAsync;

