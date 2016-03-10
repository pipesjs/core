// zip :: ReadableStream... -> ReadableStream
// zip function takes one or more streams
// and returns a readable combining the streams,
// such that it gathers chunks from all streams
// applying the first chunk as a function to the rest
// and then pushes them onto the combined
// stream, by waiting for all streams to have pushed a chunk.
//

import merge from "./merge";
import pipe from "./pipe";

export default function zip(...streams) {
  let applier, merged;

  // Merge streams
  merged = merge(...streams);

  // Create applier
  applier = pipe( chunks => {
    let [fn, ...args] = chunks;
    return fn(...args);
  });

  // return zipped stream
  return merged.pipeThrough( new applier );
}

// Browserify compat
if ( typeof module !== "undefined" )
  module.exports = zip;
