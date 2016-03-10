// connect :: Streams... -> ReadableStream | Promise
// connect function takes one or more streams
// and sequentially pipes them to each other,
// returning the result of the last pipe operation.
//

import { isTransform, isWritable } from "./utils";

export default function connect(origin, ...streams) {
  // Check origin
  if ( !origin )
    throw new Error("No streams passed");

  let sink, end;

  // Get the last stream
  sink = streams.pop();

  // if origin is a transform$, take it's readable part
  end = origin.readable || origin;

  // Connect the streams
  for ( let stream of streams ) {

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

// Browserify compat
if ( typeof module !== "undefined" )
  module.exports = connect;

