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
    _unfulfilledFutures: [],

    // Run function and enqueue result
    transform ( chunk, enqueue, done ) {
      // Run async fn
      let
        self = transformer,
        future = fn( chunk ),
        findex = self._unfulfilledFutures.length;

      // Add to executing futures list
      self._unfulfilledFutures.push( future );

      // Proceed to enqueue
      future
        .then( enqueue, () => throw new Error )
        // Remove itself from the _unfulfilledFutures list
        .then( () => self._unfulfilledFutures.splice( findex, 1 ) )
        .done( done );

      return future;
    },

    flush ( enqueue, close ) {
      let self = transformer;

      // Check if anything is left
      Promise.all( self._unfulfilledFutures )
        .then( vs => vs.map( enqueue ))
        .done( close );
    },

    // if passed
    readableStrategy,
    writableStrategy
  };

  // Wrap in blueprint class
  class TransformBlueprint extends TransformStream {
    constructor () {
      // Make stream
      let stream = super( transformer );

      // If init, push chunk
      if ( init !== void 0 )
        stream.writable.write( init );

      return stream;
    }
  }

  return TransformBlueprint;
}


