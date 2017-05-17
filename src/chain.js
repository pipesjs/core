// @flow

// chain :: TransformStreams... -> { readable, writable }
// chain function takes one or more
// transform streams / { readable, writable } pairs
// connects them to each other,
// takes the readable of the end and the writable of the head,
// returns the { readable, writable } pair that is
// compatible with `ReadableStream::pipeThrough`
//

import type { ReadableWritable } from "./streams";

import { _connect } from "./connect";
import { isTransform, isReadable } from "./utils";

const
  compatibilityError: string = `
    Only transform streams and readable-writable pairs can be chained
  `;

export default function chain(
    origin: ReadableWritable, ...streams: Array<ReadableWritable>
): ReadableWritable {

  // Check that origin is a transform stream / { readable, writable }
  if ( !isTransform( origin ))
    throw new Error( compatibilityError );

  // connect the streams
  const
    { writable } = origin,
    readable = _connect( origin, ...streams );

  // Check if null stream
  if ( !isReadable( readable ))
    throw new Error( compatibilityError );

  // return readable-writable pair
  return {
    readable,
    writable
  };
}

// Browserify compat
if ( typeof module !== "undefined" )
  // $FlowFixMe
  module.exports = chain;
