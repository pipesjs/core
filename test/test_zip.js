import assert from "assert";
import zip from "../src/zip";
import {
  createTestWritable,
  createTestReadable,
  broker
} from "./utils";

suite("merge");

test("check flow", done => {
  let readable1, readable2, writable, merged, negate;

  negate = n => -n;

  // Create test streams
  readable1 = createTestReadable( [negate, negate, negate] );
  readable2 = createTestReadable( [4,5,6] );
  writable = createTestWritable( m => assert(m < 0) );

  // End case
  broker.on(writable.signals.close, done);

  // Connect the streams
  assert.doesNotThrow( () => {
    merged = zip( readable1, readable2 );
    merged.pipeTo( writable );
  });
});


