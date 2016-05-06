import "babel-polyfill";

import assert from "assert";
import connect from "../src/connect";
import pipe from "../src/pipe";
import {
  createTestWritable,
  createTestReadable,
  broker,
  till
} from "./utils";

suite("pipe");

test("check instantiation", () => {
  let
    transform1 = new pipe( k => k ),
    transform2 = new pipe.async( async k => k ),
    transform3 = new pipe( function* (k) { return k } );

  // Check instantiation
  assert( transform1.readable );
  assert( transform1.writable );

  assert( transform2.readable );
  assert( transform2.writable );

  assert( transform3.readable );
  assert( transform3.writable );
});

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

test("check async function", done => {
  let readable, writable, transform,
    called = 0;

  // Create test streams
  readable = createTestReadable( [1,2,3] );
  writable = createTestWritable( () => called++ );
  transform = pipe.async( async function (k) {
    await till( 200 );
    return k;
  });

  // End case
  broker.on(writable.signals.close, () => {
    assert( called == 3 );
    done();
  });

  // Connect the streams
  assert.doesNotThrow( () => {
    connect( readable, (new transform), writable );
  });
});

test("check async promise function", done => {
  let readable, writable, transform,
    called = 0;

  // Create test streams
  readable = createTestReadable( [1,2,3] );
  writable = createTestWritable( () => called++ );
  transform = pipe.async( function (k) {
    // Return promie that resolves to k
    return till( 200, k );
  });

  // End case
  broker.on(writable.signals.close, () => {
    assert( called == 3 );
    done();
  });

  // Connect the streams
  assert.doesNotThrow( () => {
    connect( readable, (new transform), writable );
  });
});

test("check gen function", done => {
  let readable, writable, transform, counter = 0;

  // Create test streams
  readable = createTestReadable( [1,2,3] );
  writable = createTestWritable( () => counter+=1 );
  transform = pipe( function* (k) {
    yield k;
    return k;
  });

  // End case
  broker.on(writable.signals.close, () => {
    assert.equal( counter, 6 );
    done();
  });

  // Connect the streams
  assert.doesNotThrow( () => {
    connect( readable, (new transform), writable );
  });
});

test("check infinite gen function", done => {
  let writable, transform, counter = 0;

  // Create test streams
  writable = createTestWritable( n => {
    if ( counter >= 6 )
      return writable.close();

    counter+=n;
  });

  transform = pipe( function* (k) {
    while( !( yield k ));
  }, { init: 1 });

  // End case
  broker.on(writable.signals.close, () => {
    assert.equal( counter, 6 );
    done();
  });

  // Connect the streams
  assert.doesNotThrow( () => {
    connect( (new transform), writable );
  });
});

