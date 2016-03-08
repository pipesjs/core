// pipeGen :: Generator Function -> Opts {} -> TransformBlueprint
// pipeGen takes a generator function and wraps it into
// a transform streams. Waits till completion, before enqueuing.
// All yields are enqueued, back-pressure is respected and
// the generator paused if queue getting back-pressured.
//
// Returns a blueprint class that can be used to
// instantiate above streams.
//

import { TransformStream } from "./streams";

function consumeGen( gen, enqueue, doneFn ) {
  // Get value and signal generator to wind up
  let { value, done } = gen.next( true );
  controller.enqueue( value );

  if ( done )
    return doneFn();

  // Keep consuming
  else
    return consumeGen( gen, enqueue, doneFn );
}

function consumeGenWithBP( controller, gen, doneFn ) {
  // Check for back pressure
  // if desiredSize negative stop consuming
  if ( controller.desiredSize <= 0 )
    return;

  // Get value
  let { value, done } = gen.next();
  controller.enqueue( value );

  if ( done )
    return doneFn();

  // Keep consuming
  else
    return consumeGenWithBP( controller, gen, doneFn );
}


export default function pipeGen ( fn, {
  // opts
    init,
    readableStrategy,
    writableStrategy
  }={} ) {

  // Prepare transformer
  let transformer = {
    resume: null,
    liveGenerator: null,

    // Run function and enqueue result
    transform ( chunk, enqueue, done ) {
      // Create generator
      let
        self = transformer,
        stream = this,
        gen = fn( chunk );

      // Add to current gen
      self.liveGenerator = gen;

      // Create resume function
      self.resume = consumeGenWithBP.bind( null,
        stream.readable.controller,
        self.liveGenerator,
        done
      );

      return self.resume();
    },

    flush ( enqueue, close ) {
      let self = transformer;

      if ( self.liveGenerator )
        consumeGen( self.liveGenerator, enqueue, close );

      else
        close();
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

      // Bind transform function to stream
      transformer.transform = transformer.transform.bind(stream);

      // Wrap pull so that it can signal generator to resume
      let _pull = stream.readable.pull;
      stream.readable.pull = c => {

        let { resume } = transformer;
        resume && resume();

        return _pull(c);
      }

      // If init, push chunk
      if ( init !== void 0 )
        stream.writable.write( init );

      return stream;
    }
  }

  return TransformBlueprint;
}

