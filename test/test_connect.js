import assert from "assert";
import connect from "../src/connect";
import {
  createTestTransform,
  createTestWritable,
  createTestReadable,
  broker
} from "./utils";

suite("connect");

test("check flow", done => {
  let testChain, readable, writable, transform;

  // Create test streams
  readable = createTestReadable( [1,2,3] );
  transform = createTestTransform();
  writable = createTestWritable( assert );

  // End case
  broker.on("writable:close", done);

  // Connect the streams
  assert.doesNotThrow( () => {
    connect( readable, transform, writable );
  });
});
