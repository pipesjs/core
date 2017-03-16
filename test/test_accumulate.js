import assert from "assert";
import accumulate from "../src/accumulate";
import connect from "../src/connect";
import {
  createTestWritable,
  createTestReadable,
  broker
} from "./utils";

suite("accumulate");

test("check instantiation", () => {
  let accumulated = new accumulate( (a, b) => a+b );

  // Check instantiation
  assert(
    accumulated.readable &&
    accumulated.writable
  );
});

test("check reducer", () => {
  let readable, writable, accumulated, total;

  // Create test streams
  readable = createTestReadable( [1,2,3] );
  writable = createTestWritable( val => {
    total = val;
  });

  // Connect the streams
  accumulated = accumulate( (a, b) => a+b );

  return (
    connect( readable, (new accumulated), writable )
      .then( () => assert.equal( total, 6 ) )
  );
});

test("check reducer with init value", () => {
  let readable, writable, accumulated, total;

  // Create test streams
  readable = createTestReadable( [1,2,3] );
  writable = createTestWritable( val => {
    total = val;
  });

  // Connect the streams
  accumulated = accumulate( (a, b) => a+b, 4 );

  return (
    connect( readable, (new accumulated), writable )
      .then( () => assert.equal( total, 10 ) )
  );
});


