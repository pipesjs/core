About
-----

The `core` module contains some basic utility functions to make working with `web streams` a lot easier. Here's more about `Web Streams` from the [spec](https://streams.spec.whatwg.org) itself:

 > Large swathes of the web platform are built on streaming data: that is, data that is created, processed, and consumed in an incremental fashion, without ever reading all of it into memory. The Streams Standard provides a common set of APIs for creating and interfacing with such streaming data, embodied in readable streams, writable streams, and transform streams.

The spec is still evolving but has reached a fairly stable stage with a [reference implementation](https://github.com/whatwg/streams/tree/master/reference-implementation) as well. The API has almost been finalized and `Stream`s are coming to the web very soon!

The `core` module is designed to be extremely lightweight and barebones, the minified and gzipped build is just `4 kb`.

At it's core, the API exposes three major components:

  - `ReadableStream` encapsulates a source producing values and emits them.
  -  - `TransformStream` are essentially `{ readable, writable}` pairs that take a function which can be used to transform the values flowing through it.
  -   - `WritableStream` encapsulates a sink that receives values and writes to it.

`Stream`s are essentially data structures that handle sequential flow of values. You can split streams, merge them and connect them together in various ways. What's amazing is that, in most cases, they can handle [backpressure](https://streams.spec.whatwg.org/#pipe-chains) automatically, so you don't have to mess with the underlying details.

For further information, the spec is quite informative and easy to read. [Jake Archibald](https://github.com/jakearchibald) also wrote a great [blog post](https://jakearchibald.com/2016/streams-ftw/) on them.

**Heads up:** If you're coming from `node` land, `web streams` are quite a lot different from `node streams` and incompatible with each other.
