import assert from "assert";
import connect from "../src/connect";
import pipe from "../src/pipe";
import {
  createTestWritable,
  createTestReadable,
  broker
} from "./utils";

suite("pipe");

test("check simple function", done => {
  let readable, writable, transform;

  // Create test streams
  readable = createTestReadable( [1,2,3] );
  transform = pipe( k=>k );
  writable = createTestWritable( assert );

  // End case
  broker.on(writable.signals.close, done);

  // Connect the streams
  assert.doesNotThrow( () => {
    connect( readable, (new transform), writable );
  });
});

