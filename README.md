# pipesjs

`pipesjs` includes an evolving bunch of modules of utilities and helpers for [`web streams`](https://streams.spec.whatwg.org).

******

# pipes/ core

## Contents

 - [About](#about)
 - [Installing](#installing)
 - [API Reference](#api-reference)

## About

The `core` module contains some basic utility functions to make working with `web streams` a lot easier. Here's more about `Web Streams` from the [spec](https://streams.spec.whatwg.org) itself:

 > Large swathes of the web platform are built on streaming data: that is, data that is created, processed, and consumed in an incremental fashion, without ever reading all of it into memory. The Streams Standard provides a common set of APIs for creating and interfacing with such streaming data, embodied in readable streams, writable streams, and transform streams.

The spec is still evolving but has reached a fairly stable stage with a [reference implementation](https://github.com/whatwg/streams/tree/master/reference-implementation) as well. The API has almost been finalized and `Stream`s are coming to the web very soon!

At it's core, the API exposes three major components:

 - `ReadableStream` encapsulates a source producing values and emits them.
 - `TransformStream` are essentially `{ readable, writable}` pairs that take a function which can be used to transform the values flowing through it.
 - `WritableStream` encapsulates a sink that receives values and writes to it.

 `Stream`s are essentially data structures that handle sequential flow of values. You can split streams, merge them and connect them together in various ways. What's amazing is that, in most cases, they can handle [backpressure](https://streams.spec.whatwg.org/#pipe-chains) automatically, so you don't have to mess with the underlying details.

For further information, the spec is quite informative and easy to read. [Jake Archibald](https://github.com/jakearchibald) also wrote a great [blog post](https://jakearchibald.com/2016/streams-ftw/) on them.

 **Heads up:** If you're coming from `node` land, `web streams` are quite a lot different from `node streams` and incompatible with each other.

## Installing

### For browsers

The library depends on a [polyfill](https://github.com/creatorrr/web-stream-polyfill) for browsers that don't support `Stream` APIs yet (which as of now, is all of them), so make sure you include it in before including the library.

You can use either of the builds from the `dist` folder:

```html
    <script src="path/to/web-streams-polyfill.js"></script>
    <script src="path/to/pipes.core.js"></script>
```

And in your code, all the functions will be available on the `window.Pipes` variable.

```javascript

    let { pipe, flatten } = window.Pipes;

    flatten(/* some streams here */);
```

### For browserify users

The library has a [peer-dependency](https://nodejs.org/en/blog/npm/peer-dependencies/) on [web-streams-polyfill](https://github.com/creatorrr/web-stream-polyfill), so to install it:

```bash

    npm install web-streams-polyfill @pipes/core

```

The library is split up into modules, so you can both require the whole library or only parts of it:

```javascript

    let { flatten } = require("@pipes/core");
    let merge = require("@pipes/core/merge");
```

### For ES6 and Rollup users

If you want, you can directly import the es6 modules like so:

```javascript

    import pipes from "@pipes/core/src";
    import { flatten } from "@pipes/core/src";
    import flatten from "@pipes/core/src/flatten";
```

## API Reference

The library only consists of the following functions:

 -  chain
 -  connect
 -  flatten
 -  split
 -  pipe
 -  merge
 -  zip

### pipe

```javascript
pipe (
  Function | Generator Function,
  Object {
    init,   // value to initiate transform stream
    writableStrategy,
    readableStrategy    // instances of queuing strategies
  }
) -> TransformBlueprint // Constructor that returns transform stream
```

`pipe` function takes a transform function or generator and an opts object; returns a TransforBlueprint that can be used to create `transform streams`.

If a `Generator Function` is passed, it is consumed entirely on each transform call and results enqueud. Backpressure is handled automatically and if `stream` is cancelled, any live `generator` is gracefully shutdown. On shutdown, `generator` is sent `true` as a signal to prepare shutdown.

```javascript

// Setup
let createReadable = data => new ReadableStream({
    start (controller) {
      this.data = data || [1,2,3];

      // Kickstart stream
      controller.enqueue( this.data.pop() );
    },
    pull (controller) {
      if ( !this.data.length )
        return controller.close()

      controller.enqueue( this.data.pop() );
    }
  }),
  createWritable = () => new WritableStream({
    write (chunk) {
      console.log( chunk );
    }
  });

// Pure funtion example
let negator = pipe( n => -n ),
  rIn = createReadable(),
  rOut;

rOut = rIn.pipeThrough( new negator );  // -1, -2, -3


// Basic generator example
let doubler = pipe( function* (v) {
    yield v;
    yield v;
  }),
  rIn = createReadable(),
  rOut;

rOut = rIn.pipeThrough( new doubler );  // 1, 1, 2, 2, 3, 3


// Infinite generator example

let inf = pipe( function* (v) {
    // Close on shutdown signal
    while( !( yield v ));
  }, {
    init: 1
  });

new inf;    // 1, 1, 1, 1...
```

### pipe.async

```javascript
pipe.async (
  Async Function,
  Object {
    init,   // value to initiate transform stream
    writableStrategy,
    readableStrategy    // instances of queuing strategies
  }
) -> TransformBlueprint // Constructor that returns transform stream
```

`pipe.async` function takes an async function and an opts object; returns a TransforBlueprint that can be used to create `transform streams`.

If an `Async Function` is passed, it is run on each transform call and results awaited and then enqueud. Backpressure is handled automatically and if `stream` is cancelled, any live `future`s is gracefully shutdown.

```javascript

// Basic async example
let serverTalker = pipe.async( async function (msg) {
    let response = await sendToServer( msg );
    return response;
  }),
  rIn = createReadable(),
  rOut;

rOut = rIn.pipeThrough( new serverTalker );  // {response}, {response}, {response}

```

### chain

```javascript
chain (
  ...TransformStream()
) -> { readable, writable }
```

`chain` takes any number of `transform streams` and chains them together and returns a `transform stream` that acts as a composition of the input streams.

```javascript

// Pure funtion example
let negator = pipe( n => -n ),
  doubler = pipe( n => 2*n ),
  composed = chain( new negator, new doubler ),
  rIn = createReadable(),
  rOut;

rOut = rIn.pipeThrough( composed );  // -2, -4, -6

```

### connect

```javascript
connect (
  ReadableStream() | TransformStream(),
  ...TransformStream(),
  <Optional> WritableStream()
) -> ReadableStream() | Promise()
```

`connect` takes any number of `transform streams` with an optional `readable` at the head and a `writable` at the tail. It connects them together by applying `pipeThrough` recursively and returns the resulting `readable` that acts as a composition of the input streams.

In case, a `writable` is passed at the tail, the resulting `readable` is `pipeTo`d and the resulting `promise` is returned.
```javascript

let readable = createReadable(),
  writable = createWritable(),
  passThrough = pipe( k => k );

let promise = connect( readable, passThrough, writable );   // 1, 2, 3
```

### flatten

```javascript
flatten (
  ...ReadableStream()
) -> ReadableStream()
```

`flatten` takes any number of `readable streams` and returns a new `readable stream` with chunks enqueued as they are produced by the input streams, in order they are produced.

```javascript

let r1 = createReadable([1,2,3]),
  r2 = createReadable([4,5,6]),
  writable = createWritable(),
  flattened = flatten(r1,r2);

flattened.pipeTo( writable );   // 1,4,2,5,3,6   (order depends on order received so may vary)
```

### merge

```javascript
merge (
  ...ReadableStream()
) -> ReadableStream()
```

`merge` takes any number of `readable streams` and returns a new `readable stream` with arrays of chunks produced by all the input streams enqueued. It waits for all the streams to produce a value before grouping them together. Resulting stream closes when any of the input streams does.

```javascript

let r1 = createReadable([1,2,3]),
  r2 = createReadable([4,5,6,7]),
  writable = createWritable(),
  merged = merge(r1,r2);

merged.pipeTo( writable );   // [1,4], [2,5], [3,6]
```
