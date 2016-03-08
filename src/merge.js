// merge :: ReadableStream... -> ReadableStream
// merge function takes one or more streams
// and returns a readable combining the streams,
// such that it gathers chunks from all streams
// into an array and then pushes them onto the combined
// stream, by waiting for all streams to have pushed a chunk.
//

import { ReadableStream } from "./streams";

export default function merge(...streams) {
  let readers, chunkWaiters, mergedStream, merger;

  // Get readers
  try {
    readers = streams.map( stream => stream.getReader());

  // Check for transform streams
  } catch (e) {

    throw new Error("Only ReadableStreams can be flattened")
  }

  // Merging function
  merger = controller => {
    let
      promises = readers.map( r => r.read() ),
      merged;

    // Combine values into an array
    merged = Promise.all( promises ).then(
      controller.enqueue.bind( controller ),
      controller.error.bind( controller )
    );

    return merged;
  };

  return mergedStream = new ReadableStream({
    start: merger,
    pull: merger,

    cancel () {
      // If cancelled, cancel all streams
      streams.forEach( stream => stream.cancel() );
    }
  });
};

