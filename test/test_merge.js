import assert from "assert";
import merge from "../src/merge";
import {
  createTestWritable,
  createTestReadable,
  broker
} from "./utils";

suite("merge");

test("check flow", done => {
  let readable1, readable2, writable, merged;

  // Create test streams
  readable1 = createTestReadable( [1,2,3] );
  readable2 = createTestReadable( [4,5,6] );
  writable = createTestWritable( m => assert(m.length === 2) );

  // End case
  broker.on(writable.signals.close, done);

  // Connect the streams
  assert.doesNotThrow( () => {
    merged = merge( readable1, readable2 );
    merged.pipeTo( writable );
  });
});

