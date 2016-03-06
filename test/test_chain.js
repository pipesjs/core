import Events from "events";
import assert from "assert";
import { ReadableStream, TransformStream, WritableStream } from "../src/streams";
import chain from "../src/chain";

// consts
const
  broker = new Events,
  token = "suzanne",
  gen = c => c.enqueue(token),
  noop = (k, e, d) => e(k) && d();

suite("chain");

test("check allowed orders", () => {
  let testChain,

  // Keeps beaming token
  source = new ReadableStream({
    start: gen,
    pull: gen
  }),

  // passes token unscathed
  through = new TransformStream({
    transform: noop
  }),

  // Empty streams
  r1 = new ReadableStream,
  r2 = new ReadableStream,
  w1 = new WritableStream,
  w2 = new WritableStream;

  // Check chaining
  assert.doesNotThrow( () => {
    testChain = chain( source, w1 );
    testChain = chain( source, through, w1 );
    testChain = chain( through, source, w1 );
    testChain = chain( r1, r2, through, source, w1 );
  });

  assert.throws( () => {
    testChain = chain( w1, r1 );
  });
})

test("check flow order", done => {
  let marilyn,

  // Keeps beaming token
  source = new ReadableStream({
    start: gen,
    pull: gen
  }),

  // passes token unscathed
  through = new TransformStream({
    transform: noop
  }),

  // Emits chunks to broker
  sink = new WritableStream({
    write( chunk ) {
      broker.emit("chunk", chunk);
    }
  });

  // Chain
  marilyn = chain( source, through );

  // Set up listenener
  broker.on("chunk", chunk => {
    assert(chunk == token);

    // Clean up
    sink.close();
    source.cancel();
    done();
  });

  // pipe
  marilyn.pipeTo(sink);

});
