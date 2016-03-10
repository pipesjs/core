# pipesjs

`pipesjs` includes an evolving bunch of modules of utilities and helpers for [`web streams`](https://streams.spec.whatwg.org).

******

# pipes/ core

## TOC

 - [About](#about)
 - [Installing](#installing)

## About

The `core` module contains some basic utility functions to make working with `web streams` a lot easier. Here's more about `Web Streams` from the [spec](https://streams.spec.whatwg.org) itself:

 > Large swathes of the web platform are built on streaming data: that is, data that is created, processed, and consumed in an incremental fashion, without ever reading all of it into memory. The Streams Standard provides a common set of APIs for creating and interfacing with such streaming data, embodied in readable streams, writable streams, and transform streams.

The spec is still evolving but have reasched a fairly stable stage with a [reference implementation](https://github.com/whatwg/streams/tree/master/reference-implementation) as well. The API has almost been finalized and `Stream`s are coming to the web very soon!

At it's core, the API exposes these three major components:

 - `ReadableStream` encapsulates a source producing values and emits them.
 - `TransformStream` are essentially `{ readable, writable}` pairs that take a function which can be used to transform the values flowing through it.
 - `WritableStream` encapsulates a sink that receives values and writes to it.

 `Stream`s are essentially data structures that handle sequential flow of values. You can split streams, merge them and connect them together in various ways. What's amazing is that, in most cases, they can handle [backpressure](https://streams.spec.whatwg.org/#pipe-chains) automatically, so you don't have to mess with the underlying details.

For further information, the spec is quite informative and easy to read.

 **Heads up:** If you're coming from `node` land, web `stream`s are quite a lot different from node `stream`s and incompatible with each other.

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


