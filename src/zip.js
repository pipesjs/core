// @flow

// zip :: ReadableStream... -> ReadableStream
// zip function takes one or more streams
// and returns a readable combining the streams,
// such that it gathers chunks from all streams
// applying the first chunk as a function to the rest
// and then pushes them onto the combined
// stream, by waiting for all streams to have pushed a chunk.
//

import type { ReadableWritable } from "./streams";
import { ReadableStream } from "./streams";

import { _merge } from "./merge";
import pipe from "./pipe";

export default function zip(...streams: Array<ReadableStream>): ReadableStream {
  let applier: ReadableWritable,
      merged: ReadableStream;

  // Merge streams
  merged = _merge(...streams);

  // Create applier
  applier = new pipe( chunks => {
    let [fn, ...args] = chunks;

    if ( typeof fn !== "function" )
      throw new Error("Value is not a function");

    return fn(...args);
  });

  // return zipped stream
  return merged.pipeThrough( applier );
}

// Browserify compat
if ( typeof module !== "undefined" )
  // $FlowFixMe
  module.exports = zip;
