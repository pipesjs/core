// pipeFn :: Function -> Opts {} -> TransformBlueprint
// pipeFn takes a function and wraps it into
// a transform streams.
// Returns a blueprint class that can be used to
// instantiate above streams.
//

import { TransformStream } from "./streams";

export default function pipeFn ( fn, {
  // opts
    init,
    readableStrategy,
    writableStrategy
  }={} ) {

  // Prepare transformer
  let transformer = {
    // Run function and enqueue result
    transform ( chunk, controller ) {
      let v = fn( chunk );

      if ( v !== void 0 )
        controller.enqueue( v );
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

  return TransformBlueprint;
}

// Browserify compat
if ( typeof module !== "undefined" )
  module.exports = pipeFn;

