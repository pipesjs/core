// @flow

import type { ReadableWritable } from "./streams";
import { ReadableStream } from "./streams";

import { _merge } from "./merge";
import pipe from "./pipe";

/**
 * This function takes one or more streams and returns a readable combining
 * the streams such that it gathers chunks from all streams by  applying the
 * first chunk as a function to the rest and then pushes them onto the combined
 * stream, by waiting for all streams to have pushed a chunk.
 *
 * @example
 * let add = (a, b) => a + b,
 *   rFn = createReadable([add,add,add]),
 *   r1 = createReadable([1,2,3]),
 *   r2 = createReadable([4,5,6]),
 *   writable = createWritable(),
 *   zipped = zip(rFn,r1,r2);
 *
 * zipped.pipeTo( writable );   // 5, 7, 9
 */
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
