import assert from "assert";
import split from "../src/split";
import {
  createTestWritable,
  createTestReadable
} from "./utils";

suite("split");

test("check flow", done => {
  let readable, r1, r2, w1, w2;

  // Create test streams
  readable = createTestReadable( [1,2,3] );
  w1 = createTestWritable( n => assert( n > 0 ) );
  w2 = createTestWritable( n => assert( n > 0 ) );

  // Split the stream
  assert.doesNotThrow( () => {
    [ r1, r2 ] = split( readable );
  });

  // Connect the streams
  Promise.all([
    r1.pipeTo( w1 ),
    r2.pipeTo( w2 )
  ]).then( () => done() );
});



