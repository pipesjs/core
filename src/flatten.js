// flatten :: ReadableStream... -> ReadableStream
// flatten function takes one or more streams
// and returns a readable combining the streams,
// returning chunks as they arrive in combined streams.
//

import { ReadableStream } from "./streams";

export default function flatten(...streams) {
  let readers, chunkWaiters, mergedStream;

  // Get readers
  try {
    readers = streams.map( stream => stream.getReader());

  // Check for transform streams
  } catch (e) {

    throw new Error("Only ReadableStreams can be flattened")
  }

  return mergedStream = new ReadableStream({
    start (controller) {
      // await chunks
      chunkWaiters = readers.map( r => r.read() );

      // Function for enqueuing chunks
      let enqueueAndReplace = i => chunk => {
        // Push chunk to stream
        controller.enqueue( chunk );

        // Replace itself in the waiters
        let newPromise = readers[i].read();
        chunkWaiters[i] = newPromise.then(
          enqueueAndReplace(i),

          // error handling
          controller.error.bind(controller)
        );

        return chunk;
      };

      // Add replacement hooks
      chunkWaiters.map( (promise, i) => {

        return promise.then(
          enqueueAndReplace(i),
          controller.error.bind(controller)
        );

      });
    },

    pull (controller) {
      // The first promise to resolve
      // pushes chunk on to the queue
      // and frees the stream to pull again.
      return Promise.race( chunkWaiters );

    },

    cancel () {
      // If cancelled, cancel all streams
      streams.forEach( stream => stream.cancel() );
    }
  });
};



