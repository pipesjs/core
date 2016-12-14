import assert from "assert";
import chain from "../src/chain";
import connect from "../src/connect";
import pipe from "../src/pipe";
import {
  createTestWritable,
  createTestReadable,
  broker
} from "./utils";

suite("chain");

test("check chaining", done => {
  let readable, writable, transform, testChain;

  // Create test streams
  readable = createTestReadable( [1,2,3] );
  transform = pipe( k=>k );
  writable = createTestWritable( assert );

  // End case
  broker.on(writable.signals.close, done);

  // Connect the streams
  testChain = chain(
    new transform,
    new transform,
    new transform
  );

  return connect( readable, testChain, writable );
});


