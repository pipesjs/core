// chain :: TransformStreams... -> { readable, writable }
// chain function takes one or more
// transform streams / { readable, writable } pairs
// connects them to each other,
// takes the readable of the end and the writable of the head,
// returns the { readable, writable } pair that is
// compatible with `ReadableStream::pipeThrough`
//

import connect from "./connect";
import { isTransform, isReadable } from "./utils";

const
  compatibilityError = `
    Only transform streams and readable-writable pairs can be chained
  `;

export default function chain(origin, ...streams) {

  // Check that origin is a transform stream / { readable, writable }
  if ( !isTransform( origin ))
    throw new Error( compatibilityError );

  // connect the streams
  const
    { writable } = origin,
    readable = connect( origin, ...streams );

  // Check if null stream
  if ( !isReadable( readable ))
    throw new Error( compatibilityError );

  // return readable-writable pair
  return {
    readable,
    writable
  };
}
