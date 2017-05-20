// @flow

import type { ReadableWritable } from "./streams";

import { _connect } from "./connect";
import { isTransform, isReadable } from "./utils";

const
  compatibilityError: string = `
    Only transform streams and readable-writable pairs can be chained
  `;

/**
 * This function takes one or more transform streams / { readable, writable } pairs
 * connects them to each other. Then takes the readable of the end and the writable
 * of the head and returns the { readable, writable } pair that is
 * compatible with `ReadableStream::pipeThrough`.
 *
 * @example
 * // Pure funtion example
 * let negator = pipe( n => -n ),
 *   doubler = pipe( n => 2*n ),
 *   composed = chain( new negator, new doubler ),
 *   rIn = createReadable(),
 *   rOut;
 *
 * rOut = rIn.pipeThrough( composed );  // -2, -4, -6
 */
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
