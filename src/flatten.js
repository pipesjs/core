// @flow

import type { ReadableStreamController } from "./streams";

import { ReadableStream, WritableStream } from "./streams";
import { zipWith } from "./utils";

/**
 * This function takes one or more streams and returns a readable combining
 * the streams, returning chunks as they arrive in combined streams.
 *
 * @example
 * let r1 = createReadable([1,2,3]),
 *   r2 = createReadable([4,5,6]),
 *   writable = createWritable(),
 *   flattened = flatten(r1,r2);
 *
 * flattened.pipeTo( writable );   // 1,4,2,5,3,6   (order depends on order received so may vary)
 */
export default function flatten(...streams: Array<ReadableStream>): ReadableStream {
  let
    flattenedStream: ReadableStream,
    writers: Array<WritableStream> = [];

  return flattenedStream = new ReadableStream({
    start (controller: ReadableStreamController): Promise<mixed> {

      // Create writers for each stream
      while ( writers.length < streams.length )
        writers.push( new WritableStream({
            // write incoming to flattenedStream
            write: controller.enqueue.bind( controller )
          })
        );

      // Connect streams to writers
      let
        connect: (ReadableStream, WritableStream) => Promise<mixed> =
          (r, w) => r.pipeTo( w ),
        pipedAll: Array<Promise<mixed>>;

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

    cancel (): void {
      // If cancelled, cancel all streams
      streams.forEach( stream => stream.cancel() );
    }
  });
};

// Browserify compat
if ( typeof module !== "undefined" )
  // $FlowFixMe
  module.exports = flatten;
