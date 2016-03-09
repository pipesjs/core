import assert from "assert";
import flatten from "../src/flatten";
import {
  createTestWritable,
  createTestReadable,
  broker
} from "./utils";

suite("flatten");

test("check flow", done => {
  let readable1, readable2, writable, flattened, counter = 0;

  // Create test streams
  readable1 = createTestReadable( [1,2,3] );
  readable2 = createTestReadable( [4,5,6] );
  writable = createTestWritable( () => counter+=1 );

  // End case
  broker.on(writable.signals.close, () => {
    assert.equal( counter, 6 );
    done();
  });

  // Connect the streams
  assert.doesNotThrow( () => {
    flattened = flatten( readable1, readable2 );
    flattened.pipeTo( writable );
  });
});


