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

// Manages generator object and consumes it
// while taking backpressure into account
class GenObjManager {
  constructor ( gen, enqueue, readable ) {
    let
      done,
      promise = new Promise( resolve => { done = resolve });

    // Add props
    Object.assign( this, {
      done, gen, enqueue, readable, promise,
      running: false
    });
  }

  // Make manager a thenable
  get then () { return this.promise.then.bind(this.promise); }

  // Get backpressure signals
  get ready () { return this.readable._controller.desiredSize >= 0 }

  // Kick start the read loop
  start () {
    if ( this.running || !this.gen )
      return;

    // Start the loop
    this.running = true;
    this.tick();
  }

  pause () {
    this.running = false;
  }

  close () {
    this.pause();

    // Close generator
    this.gen.return();
    this.gen = null;

    // Call done
    this.done();
  }

  // Flush the gen and close
  flush (n=1) {
    if ( !this.gen )
      return;

    // Pause
    this.pause();

    // Read gen n times
    // passing it a true value to signal shutdown
    while (n--)
      this.tick( true );

    // Close the generator
    this.close();
  }

  tick ( msg ) {
    // Get next value
    let { value, done } = this.gen.next( msg );

    // Enqueue value to stream
    this.enqueue( value );

    // Process next tick
    if ( done ) {
      this.close();

    } else if ( this.running && this.ready ) {
      this.tick( msg );

    } else {
      this.pause();
    }
  }
}

export default function pipeGen ( fn, {
  // opts
    init,
    readableStrategy,
    writableStrategy
  }={} ) {

  // Prepare transformer
  let
    genManager,
    transformer = {
    transform ( chunk, enqueue, done ) {
      // Create generator manager
      genManager = new GenObjManager(
        fn( chunk ),
        enqueue,
        this.readable
      );

      // Set up closing
      genManager.then( () => done() );

      // Start consuming
      genManager.start();
    },

    flush ( enqueue, close ) {
      // Flush generator
      genManager && genManager.flush();
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

      // Super hacky because TransformStream doesn't allow an easy way to do this
      // Wrap pull so that it can signal generator to resume
      let _pull = stream.readable._underlyingSource.pull;
      stream.readable._underlyingSource.pull = c => {

        // Resume generator manager
        genManager && genManager.start();

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

