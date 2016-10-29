# pipesjs

<style>@font-face {  font-family: 'Open Sans';  font-style: normal;  font-weight: 400;  src: local('Open Sans'), local('OpenSans'), url('data:font/woff2;base64,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') format('woff2');}@font-face {  font-family: 'Open Sans';  font-style: normal;  font-weight: 700;  src: local('Open Sans Bold'), local('OpenSans-Bold'), url('data:font/woff2;base64,d09GMgABAAAAAAbsAA4AAAAAC3AAAAaYAAEZmgAAAAAAAAAAAAAAAAAAAAAAAAAAGhYbDBwMBmAAfBEMCo1gilQBNgIkA2ALMgAEIAWCXAcgG78IEdWsHgA0UhbO388ndb5Psh2QpQ/A4y/tTKECopbQZCe9nWEmGsbeyf5IU3kF+QDd/Ne6S7P6k6/BaKCaG9z4QfYNDZxTN9p0AnkAWjY+kpIi8S18bb5FNN7soHwR+dsQS5kxdo5YamaH9XQQABxMpSOeShBZZbwZ/c2GVUjfw0LIumbNAUgjLDK+4gD5G6LUDgUMyyyjzVHQH/PRtBVA1/SHzVqwaRGa0KT/BRr/lyEbytNEU1Fu60PmDusleJpgRNSNdSEmTr1bhSIYCKEJC7AEy7EWUezGfhzCCZzX2veTC7AIy7EGG7Ebe3EIx3FGaz2mv+jP+qN+q1/pF/q5fqof6nvzV8DGEVCEwLRG4ZhaJYHdUl3NIH8A+s3aNP1U2nTCG6ncSHVs/QmhQGU4yHl5UbiwK1RazSpKRbC8oq28uKOivHRLQYJLcflCv9+gEtLpRVq4capYbtpIDUzYbjTi+zI9ybkU+al9Gc4Cdr60SBajgApwWii5VWByKcxCSxRfYX0wuRSXbSkucyvVs5VdkvwK68NnRT+xhLTdHpLyGTPpkvwYkioyFeVHZHKUOTHD82xG+THf90lqwna9ZbzLHIXkFy/qeYU8zI1SymUgqUZZbpoERSDpWBAsjjGlmNNO64nHSYo5kViP7Xowj0SUQtIu5fhVKzMjMgsxh6bhlThV6rjTb2QGbDdq+8QQl1mMqZjbE18qE/ssTzoqInz/Um7ayMzY7hRQ8BTFoVQpt1KWTEZxmoxE7LCMRvOvaNiO2j3ESX4Pprqc3SAP0p2XeInOh5o70nISaEF9NOG+vdGu/zphziA6vvGrFUN8pD+f5ND4fElIQ4rouLopXlKa2Kd/KKQ0y7EoRbkoJYLrv6eZm7eHljFxw6C5hts+5wd4cSc37Ge8flkx+1YYsSXknmd0Z/GTZQkO4otXr+Xn/I42WuYMfszLotnt3fNBik/nDwm8k68vXLaj5wAkQkCKQ/4peb//916ghIRM2Df4NjiAFDu4+7rbQ1+FaGYrpNWtVAYpXq68NJ2h8iV9OUjxlK2URLukIlt1qgCpYxg0PhLDVjBo3agMUtxnvDWQKaNVv1UVOo8tcyeHsooKR/jT0/soB5Di1WbaN+4KRSeETsFvckYTU23gXTX9mNbjf6+28LmT3mfs4/NLw8PNrX1S3Ud8ezx6aiJnFRxi3H1Rfc6+0ibnQ631TMOQxLRoH9PUGKfZwWeyZhzBG4etIokoCRHin4o3Lx77LC/creHI/b3evn1V37x5M/vnr25FvssMVljm4pCuRTu2r978Y+Uv1kGSWr2+d2tU7tkDua8fvj984qUVWUfvpgv5ycKpxW2CPOQpcty1NS3Yh2aFJr0O1Go28HgXE/QucZpVCEUGW03XB03x6ANKVvEJ7+Tl8iUclZbsfB4YSq9cxqQLlhZ9qivtIxZP2Vo+pzW/cu2yZVVLYfR5dlZZE7NyLa2yqomes17G2lReXY334y1T+t3Ui4RwdLwzb4tpluWbSONtRlhJiT5t7ahad1iGAkOJcjdk9DOS5PKW3Dt6+vIxDFAiQVQjv65ozVEZKv2lyYi8RdiqhPLfiUs0LcLXx5fvO3To+k2eSBDVyK8sX7AeKymRIL4xvaNq9TEZKv2lyYg8L2pzTPXhk5eOgyJqPPpVtIPtJxZP63Om0p9b7Ja1TdtYDZeDYWvfbXnXtIYbovsnzviKffTyTIM9JU5Jhh32jSkO9fxpzxZfObWPn3I7Vn/cMqwv2DTBdcKl006Q4tyA+ntRFXqPq3jLty/fsVNzQrgij//68Dvnp86a3kHu2GEyImcTviWu5ujxS8duUgsU3rFrAZr6bDondnWGrNtXFpt1RU76qC6Ud78IWfRb6u9KjoglAg1sSHh+mSX6uxLgiH5L/RNwRG9xohpxFgcllI4kewBSHQ3kG+wgmrGDoYsdzCEAhDAZ9ARRiHRiMUwZUlhPXEUCoY1UUg6pxK7i6oOFzNtYCNMXj6X/QipdAGvSB7OjlqphECpIBDliWq+AO7HcTCT3bIKNmoJGIbKQWcARSkcANFACWshESaihBWVAA1Ofl0Ec1iMSlchDObiIRRbKUQMfVKAUufAuao6eqsPloRpcWILrY3Ib0/PVoQjbp2ADG1QT5o7XoAgVVh4KVp4CCQRZritELWpRCRdYwxoNPGmFLFSezdvyYIUKVKMA1ihFUQ5gjVyD54UhGL7wRwRi4Q9L8GAFm/8F9N3yfz7yD24AAAA=') format('woff2');}.rc-pill {  font-family: 'Open Sans', sans-serif;  border-radius: 4px;  display: inline-block;  position: relative;  overflow: hidden;  white-space: nowrap;  font-size: 11px;  cursor: pointer;}.rc-pill strong {  font-weight: bold;}.rc-pill a {  color: white;  text-shadow: rgba(1, 1, 1, 0.3) 0.75px 0.75px 0px;}.rc-pill div {  display: inline-block;  padding: 2px 5px 2px 5px;}.rc-pill .l {  background: #555;  background: -webkit-linear-gradient(#555, #484848);  background: linear-gradient(#555, #484848);}.rc-pill .r {  background: #61ae24;  background: -webkit-linear-gradient(#61ae24, #559920);  background: linear-gradient(#61ae24, #559920);}.rc-pill i.icon-svg svg {  height: 1em;  margin-right: 0.33em;  margin-bottom: -1px;  display: inline-block;}</style><div class="rc-pill"><a href="http://www.recurse.com" title="Made with love at the Recurse Center"><div class="l"><span>made at </span></div><div class="r"><i class="icon-svg"><svg viewBox="0 0 12 15"><rect x="0" y="0" width="12" height="10" fill="black"></rect><rect x="1" y="1" width="10" height="8" fill="white"></rect><rect x="2" y="2" width="8" height="6" fill="black"></rect><rect x="2" y="3" width="1" height="1" fill="#61ae24"></rect><rect x="4" y="3" width="1" height="1" fill="#61ae24"></rect><rect x="6" y="3" width="1" height="1" fill="#61ae24"></rect><rect x="3" y="5" width="2" height="1" fill="#61ae24"></rect><rect x="6" y="5" width="2" height="1" fill="#61ae24"></rect><rect x="4" y="9" width="4" height="3" fill="black"></rect><rect x="1" y="11" width="10" height="4" fill="black"></rect><rect x="0" y="12" width="12" height="3" fill="black"></rect><rect x="2" y="13" width="1" height="1" fill="white"></rect><rect x="3" y="12" width="1" height="1" fill="white"></rect><rect x="4" y="13" width="1" height="1" fill="white"></rect><rect x="5" y="12" width="1" height="1" fill="white"></rect><rect x="6" y="13" width="1" height="1" fill="white"></rect><rect x="7" y="12" width="1" height="1" fill="white"></rect><rect x="8" y="13" width="1" height="1" fill="white"></rect><rect x="9" y="12" width="1" height="1" fill="white"></rect></svg></i><span>Recurse Center</span></div></a></div>

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

The `core` module is designed to be extremely lightweight and barebones, the minified and gzipped build is just `4 kb`.

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

 -  [pipe](#pipe)
 -  [pipe.async](#pipeasync)
 -  [accumulate](#accumulate)
 -  [chain](#chain)
 -  [connect](#connect)
 -  [flatten](#flatten)
 -  [merge](#merge)
 -  [zip](#zip)
 -  [split](#split)

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

If a `Generator Function` is passed, it is consumed entirely on each transform call and results enqueued. Backpressure is handled automatically and if `stream` is cancelled, any live `generator` is gracefully shutdown. On shutdown, `generator` is sent `true` as a signal to prepare shutdown.

If the function doesn't return anything or returns `undefined`, nothing is written on the stream.

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
  Async Function | Function -> Promise(),
  Object {
    init,   // value to initiate transform stream
    writableStrategy,
    readableStrategy    // instances of queuing strategies
  }
) -> TransformBlueprint // Constructor that returns transform stream
```

`pipe.async` function takes an async function or a function that returns a promise and an opts object; returns a TransforBlueprint that can be used to create `transform streams`.

If an `Async Function` is passed, it is run on each transform call and results awaited and then enqueued.

If a `Function` is passed that returns a `promise`. The value that the promise resolves to is enqueued.

Backpressure is handled automatically and if `stream` is cancelled, any live `future`s is gracefully shutdown.

If the function doesn't return anything or returns `undefined`, nothing is written on the stream.

```javascript

// Basic async example
let serverTalker = pipe.async( async function (msg) {
    let response = await sendToServer( msg );
    return response;
  }),
  rIn = createReadable(),
  rOut;

rOut = rIn.pipeThrough( new serverTalker );  // {response}, {response}, {response}

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

### accumulate

```javascript
accumulate(
  Function,     // Reducing function
  InitValue     // (Optional) Initial value
) -> ReadableWritableBlueprint // readable-writable pair
```

`accumulate` function takes a reducer function and an optional inital value.

Returns a ReadableWritableBlueprint that consumes the piped stream, combining the values with the reducer and enqueues the result.

```javascript

let readable, accumulator, accumulated, total;

  // Create streams
  readable = createTestReadable( [1,2,3] );

  // Connect the streams
  accumulator = accumulate( (a, b) => a+b, 4 );
  accumulated = readable.pipeThrough( new accumulator );    // 10

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

### zip

```javascript
zip (
  ReadableStream()<Function>,
  ...ReadableStream()
) -> ReadableStream()
```

`zip` takes a `readable` producing functions and any number of `readable streams` and returns a new `readable stream` with the results of functions applied to corresponding chunks produced by the rest input streams enqueued. It waits for all the streams to produce a value before zipping them together. Resulting stream closes when any of the input streams does.

```javascript

let add = (a, b) => a + b,
  rFn = createReadable([add,add,add]),
  r1 = createReadable([1,2,3]),
  r2 = createReadable([4,5,6]),
  writable = createWritable(),
  zipped = zip(rFn,r1,r2);

zipped.pipeTo( writable );   // 5, 7, 9
```

### split

```javascript
split (
  ReadableStream(),
  Int (default=2)
) -> [...ReadableStream()]
```

`split` takes a `readable` and a number of branches, returns an array of `readable`s that are copies of the original. `ReadableStream().tee` is called repeatedly to produce the branches.

To cancel the original stream, all the branches must be canceled first. Hence the resulting branches have an added `cancelAll()` method that cancels all the branches and the original stream.

```javascript

let readable = createReadable([1,2,3]),
  [r1, r2] = split( readable ),
  w1 = createWritable(),
  w2 = createWritable();

r1.pipeTo( w1 );   // 1, 2, 3
r2.pipeTo( w2 );   // 1, 2, 3
```

## Thanks

The domain is kindly hosted by:

![JS.ORG | JavaScript Community](https://logo.js.org/dark_tiny.png "JS.ORG | JavaScript Community")
