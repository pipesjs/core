import Events from "events";
import { ReadableStream, TransformStream, WritableStream } from "../src/streams";

export const broker = new Events;

export function till ( time, value=null ) {
  return new Promise( resolve => setTimeout( resolve.bind( null, value ), time ) );
}

export function createTestReadable (data) {
  // Ensure data
  if ( !data )
    data = [1,2,3,4,5];

  const signals = {
    init: Symbol(),
    cancel: Symbol()
  };

  let stream = new ReadableStream({
    start (c) {
      broker.emit(signals.init);
      c.enqueue(data.pop());
    },
    pull (c) {
      if ( !data.length )
        c.close();

      c.enqueue(data.pop());
    },
    cancel () {
      broker.emit(signals.cancel);
    }
  });

  stream.signals = signals;
  return stream;
}

export function createTestWritable (fn) {

  const signals = {
    init: Symbol(),
    recv: Symbol(),
    close: Symbol()
  };

  let stream = new WritableStream({
    start () {
      broker.emit(signals.init);
    },
    write (chunk) {
      fn( chunk );
      broker.emit(signals.recv, chunk);
    },
    close () {
      broker.emit(signals.close);
    }
  });

  stream.signals = signals;
  return stream;
}

export function createTestTransform () {
  return new TransformStream({
    transform (chunk, enqueue, done) {
      enqueue( chunk );
      return done();
    }
  });
}
