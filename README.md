<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [Introducing pipes/core](#introducing-pipescore)
-   [About](#about)
-   [Installing](#installing)
-   [API Reference](#api-reference)
-   [accumulate](#accumulate)
-   [connect](#connect)
-   [chain](#chain)
-   [flatten](#flatten)
-   [merge](#merge)
-   [pipe](#pipe)
-   [pipe.async](#pipeasync)
-   [pipe.eos](#pipeeos)
-   [split](#split)

## Introducing pipes/core

<a href='http://www.recurse.com' title='Made with love at the Recurse Center'><img src='https://cloud.githubusercontent.com/assets/2883345/11325206/336ea5f4-9150-11e5-9e90-d86ad31993d8.png' height='20px'/></a>

`pipesjs` includes an evolving bunch of modules of utilities and helpers for [`web streams`](https://streams.spec.whatwg.org).

* * *


## About

The `core` module contains some basic utility functions to make working with `web streams` a lot easier. Here's more about `Web Streams` from the [spec](https://streams.spec.whatwg.org) itself:

> Large swathes of the web platform are built on streaming data: that is, data that is created, processed, and consumed in an incremental fashion, without ever reading all of it into memory. The Streams Standard provides a common set of APIs for creating and interfacing with such streaming data, embodied in readable streams, writable streams, and transform streams.

The spec is still evolving but has reached a fairly stable stage with a [reference implementation](https://github.com/whatwg/streams/tree/master/reference-implementation) as well. The API has almost been finalized and `Stream`s are coming to the web very soon!

The `core` module is designed to be extremely lightweight and barebones, the minified and gzipped build is just `4 kb`.

At it's core, the API exposes three major components:

-   `ReadableStream` encapsulates a source producing values and emits them.
-   `TransformStream` are essentially `{ readable, writable}` pairs that take a function which can be used to transform the values flowing through it.
-   `WritableStream` encapsulates a sink that receives values and writes to it.

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

The `core` library only consists of the following functions:

-   [pipe](#pipe)
-   [pipe.async](#pipeasync)
-   [accumulate](#accumulate)
-   [chain](#chain)
-   [connect](#connect)
-   [flatten](#flatten)
-   [merge](#merge)
-   [zip](#zip)
-   [split](#split)

**Set up code for examples**

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
```


## accumulate

This function takes a reducer function and an optional initial value and
returns a transformstream that accumulates the values of any stream piped to it.

**Parameters**

-   `reducer` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a function that takes sequential values and reduces them
-   `init` **any?** 

**Examples**

```javascript
let readable, accumulator, accumulated, total;

  // Create streams
  readable = createTestReadable( [1,2,3] );

  // Connect the streams
  accumulator = accumulate( (a, b) => a+b, 4 );
  accumulated = readable.pipeThrough( new accumulator );    // 10
```

Returns **TransformStream** a ReadableWritable that consumes piped
stream, combining the values with the reducer and enqueues the result.

## connect

This function takes any number of `transform streams` with an optional `readable` at the head and a `writable` at the tail.
It connects them together by applying `pipeThrough` recursively and returns the resulting `readable` that acts as a composition of the input `streams`.

In case, a `writable` is passed at the tail, the resulting `readable` is `pipeTo`d and the resulting `promise` is returned.

**Parameters**

-   `origin` **(ReadableStream | ReadableWritable)** 
-   `streams` **...[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;(WritableStream | ReadableWritable)>** 

**Examples**

```javascript
let readable = createReadable(),
  writable = createWritable(),
  passThrough = pipe( k => k );

let promise = connect( readable, passThrough, writable );   // 1, 2, 3
```

Returns **(ReadableStream | [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;any>)** 

## chain

This function takes one or more transform streams / { readable, writable } pairs
connects them to each other. Then takes the readable of the end and the writable
of the head and returns the { readable, writable } pair that is
compatible with `ReadableStream::pipeThrough`.

**Parameters**

-   `origin` **ReadableWritable** 
-   `streams` **...[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;ReadableWritable>** 

**Examples**

```javascript
// Pure funtion example
let negator = pipe( n => -n ),
  doubler = pipe( n => 2*n ),
  composed = chain( new negator, new doubler ),
  rIn = createReadable(),
  rOut;

rOut = rIn.pipeThrough( composed );  // -2, -4, -6
```

Returns **ReadableWritable** 

## flatten

This function takes one or more streams and returns a readable combining
the streams, returning chunks as they arrive in combined streams.

**Parameters**

-   `streams` **...[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;ReadableStream>** 

**Examples**

```javascript
let r1 = createReadable([1,2,3]),
  r2 = createReadable([4,5,6]),
  writable = createWritable(),
  flattened = flatten(r1,r2);

flattened.pipeTo( writable );   // 1,4,2,5,3,6   (order depends on order received so may vary)
```

Returns **ReadableStream** 

## merge

This function takes one or more streams and returns a readable combining
the streams, such that it gathers chunks from all streams into an array and
then pushes them onto the combined stream, by waiting for all streams to
have pushed a chunk.

**Parameters**

-   `streams` **...[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;ReadableStream>** 

**Examples**

```javascript
let r1 = createReadable([1,2,3]),
  r2 = createReadable([4,5,6,7]),
  writable = createWritable(),
  merged = merge(r1,r2);

merged.pipeTo( writable );   // [1,4], [2,5], [3,6]
```

Returns **ReadableStream** 

## pipe

This function takes any normal/generator func and returns a transform stream.

**Parameters**

-   `fn` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a function or a generator that returns transformed values
-   `opts` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** containing config options

**Examples**

```javascript
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
```

```javascript
// Infinite generator example

  let inf = pipe( function* (v) {
      // Close on shutdown signal
      while( !( yield v ));
  }, {
      init: 1
  });

  new inf;    // 1, 1, 1, 1...
```

Returns **TransformStream** 

## pipe.async

This function takes any async func and returns a transform stream.

**Parameters**

-   `asyncFunction` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** an async function that returns a Promise
-   `opts` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** containing config options

**Examples**

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

```javascript
// Basic promise example
let serverTalker = pipe.async( function (msg) {
    let response = new Promise( resolve => {
      sendToServer( msg, resolve );
    });
    return response;
  }),
  rIn = createReadable(),
  rOut;

rOut = rIn.pipeThrough( new serverTalker );  // {response}, {response}, {response}
```

Returns **any** TransformStream

## pipe.eos

"End of Stream" This is the equivalent of `EOF` char in UNIX systems, if a `pipe` `function` returns
this at any point, the streams are gracefully closed.

## split

This function takes a readable stream and a number and returns an array of
tee'd readable streams, with a `cancelAll` function that cancels all the tee'd
streams and in turn the original stream.

**Parameters**

-   `stream` **ReadableStream** 
-   `parts` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**  (optional, default `2`)

**Examples**

```javascript
let readable = createReadable([1,2,3]),
  [r1, r2] = split( readable ),
  w1 = createWritable(),
  w2 = createWritable();

r1.pipeTo( w1 );   // 1, 2, 3
r2.pipeTo( w2 );   // 1, 2, 3
```

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;ReadableStream>** 
