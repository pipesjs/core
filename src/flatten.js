// flatten :: ReadableStream... -> ReadableStream
// flatten function takes one or more streams
// and returns a readable combining the streams,
// returning chunks as they arrive in combined streams.
//

import { ReadableStream, WritableStream } from "./streams";
import { zipWith } from "./utils";

export default function flatten(...streams) {
  let
    flattenedStream,
    writers = [];

  return flattenedStream = new ReadableStream({
    start (controller) {
      // Create writers for each stream
      while ( writers.length < streams.length )
        writers.push( new WritableStream({
            // write incoming to flattenedStream
            write: controller.enqueue.bind( controller )
          })
        );

      // Connect streams to writers
      let
        connect = (r, w) => r.pipeTo( w ),
        pipedAll;

      try {
        pipedAll = zipWith( connect, streams, writers );

      } catch (e) {
        throw new Error("Only readable streams can be flattened.");
      }

      // Set up closing
      return Promise.all( pipedAll ).then(
        controller.close.bind( controller ),
        controller.error.bind( controller )
      );
    },

    cancel () {
      // If cancelled, cancel all streams
      streams.forEach( stream => stream.cancel() );
    }
  });
};

// Browserify compat
if ( typeof module !== "undefined" )
  module.exports = flatten;

