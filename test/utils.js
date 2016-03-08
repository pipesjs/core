import Events from "events";
import { ReadableStream, TransformStream, WritableStream } from "../src/streams";

export const broker = new Events;

export function createTestReadable (data) {
  // Ensure data
  if ( !data )
    data = [1,2,3,4,5];

  return new ReadableStream({
    start (c) {
      broker.emit("readable:init");
      c.enqueue(data.pop());
    },
    pull (c) {
      if ( !data.length )
        c.close();

      c.enqueue(data.pop());
    },
    cancel () {
      broker.emit("readable:cancel");
    }
  });
}

export function createTestWritable (fn) {
  return new WritableStream({
    start () {
      broker.emit("writable:init");
    },
    write (chunk) {
      fn( chunk );
      broker.emit("writable:recv", chunk);
    },
    close () {
      broker.emit("writable:close");
    }
  });
}

export function createTestTransform () {
  return new TransformStream({
    transform (chunk, enqueue, done) {
      enqueue( chunk );
      return done();
    }
  });
}
