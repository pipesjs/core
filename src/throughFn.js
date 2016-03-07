// throughFn :: Function -> Opts {} -> TransformBlueprint
// throughFn takes a function and wraps it into
// a transform streams.
// Returns a blueprint class that can be used to
// instantiate above streams.
//

import { TransformStream } from "./streams";

export default function throughFn ( fn, {
  // opts
    init,
    readableStrategy,
    writableStrategy
  }={} ) {

  // Prepare transformer
  let transformer = {
    // Run function and enqueue result
    transform ( chunk, enqueue, done ) {
      return enqueue( fn ( chunk )) && done();
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

