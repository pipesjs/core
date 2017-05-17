// @flow

// connect :: Streams... -> ReadableStream | Promise
// connect function takes one or more streams
// and sequentially pipes them to each other,
// returning the result of the last pipe operation.
//

import type { ReadableWritable } from "./streams";
import { ReadableStream, WritableStream } from "./streams";

import { isTransform, isWritable } from "./utils";

export default function connect(
    origin: ReadableStream | ReadableWritable,
    ...streams: Array<WritableStream | ReadableWritable>
): ReadableStream | Promise<mixed> {

  // Check origin
  if ( !origin )
    throw new Error("No streams passed");

  let sink: WritableStream | ReadableStream,
      end: ReadableStream;

  // Get the last stream
  sink = streams.pop();

  // if origin is a transform$, take it's readable part
  if ( origin instanceof ReadableStream ) {
    end = origin;
  } else {
    end = origin.readable;
  }

  // Connect the streams
  for ( let stream: ReadableWritable of streams ) {

    // Check for transform streams
    if ( !isTransform( stream ))
      throw new Error("Only transform streams allowed in the center");

    // piping through a transform returns it's readable part
    end = end.pipeThrough( stream );
  }

  // Handle sink
  if ( isWritable( sink ))
    end = end.pipeTo( sink );

  else if ( isTransform( sink ))
    end = end.pipeThrough( sink );

  else
    throw new Error("Only writable and transform streams allowed at the end.");

  // Return result
  return end;
}

// FIXME: Internal flow.js resolution problem workaround
export const _connect = connect;

// Browserify compat
if ( typeof module !== "undefined" )
  // $FlowFixMe
  module.exports = connect;
