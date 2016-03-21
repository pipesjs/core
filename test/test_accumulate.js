import assert from "assert";
import accumulate from "../src/accumulate";
import connect from "../src/connect";
import {
  createTestWritable,
  createTestReadable,
  broker
} from "./utils";

suite("accumulate");

test("check reducer", done => {
  let readable, writable, accumulated, total;

  // Create test streams
  readable = createTestReadable( [1,2,3] );
  writable = createTestWritable( val => {
    total = val;
  });

  // End case
  broker.on(writable.signals.close, () => {
    assert.equal( total, 6 );
    done();
  });

  // Connect the streams
  assert.doesNotThrow( () => {
    accumulated = accumulate( (a, b) => a+b );
    connect( readable, (new accumulated), writable );
  });
});

test("check reducer with init value", done => {
  let readable, writable, accumulated, total;

  // Create test streams
  readable = createTestReadable( [1,2,3] );
  writable = createTestWritable( val => {
    total = val;
  });

  // End case
  broker.on(writable.signals.close, () => {
    assert.equal( total, 10 );
    done();
  });

  // Connect the streams
  assert.doesNotThrow( () => {
    accumulated = accumulate( (a, b) => a+b, 4 );
    connect( readable, (new accumulated), writable );
  });
});


