// @flow

// merge :: ReadableStream... -> ReadableStream
// merge function takes one or more streams
// and returns a readable combining the streams,
// such that it gathers chunks from all streams
// into an array and then pushes them onto the combined
// stream, by waiting for all streams to have pushed a chunk.
//

import type {
  valueDone, ReadableStreamReader, ReadableStreamController
} from "./streams";

import { ReadableStream } from "./streams";

// Parses arrays of {value, done} pairs to final pair
function parseResults (results: Array<?valueDone>): valueDone {
  let
    ended: boolean = false,
    values: Array<mixed> = [];

  // Accumulate values
  for ( let result: ?valueDone of results ) {
    if ( result == null ) break;

    let { value, done } = result;
    ended = ended || done;
    values.push( value );
  }

  return {
    value: values,
    done: ended
  };
}

export default function merge(...streams: Array<ReadableStream>): ReadableStream {
  let readers: Array<ReadableStreamReader>,
      mergedStream: ReadableStream,
      merger: (ReadableStreamController) => Promise<?valueDone>;

  // Get readers
  try {
    readers = streams.map( (stream: ReadableStream) => stream.getReader());

  // Check for transform streams
  } catch (e) {

    throw new Error("Only ReadableStreams can be flattened")
  }

  // Merging function
  merger = controller => {
    let
      // Get read promises
      promises: Array<Promise<?valueDone>> = readers.map( r => r.read() ),
      merged: Promise<?valueDone>,
      push;

    // Read values and push them onto the stream
    push = (obj: valueDone): ?valueDone => {
      let { value, done } = obj;

      if ( done )
        return controller.close();

      controller.enqueue( value );
      return obj;
    };

    // Combine values into an array
    merged = Promise.all( promises )
      .then( parseResults )
      .then( push, controller.error.bind( controller ));

    return merged;
  };

  return mergedStream = new ReadableStream({
    start: merger,
    pull: merger,

    cancel (): void {
      // If cancelled, cancel all streams
      streams.forEach( stream => stream.cancel() );
    }
  });
};

// FIXME: Internal flow.js resolution problem workaround
export const _merge = merge;

// Browserify compat
if ( typeof module !== "undefined" )
  // $FlowFixMe
  module.exports = merge;
