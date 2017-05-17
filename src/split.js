// @flow

import { ReadableStream } from "./streams";

/**
 * This function takes a readable stream and a number and returns an array of
 * tee'd readable streams, with a `cancelAll` function that cancels all the tee'd
 * streams and in turn the original stream.
 */
export default function split(
  stream: ReadableStream, parts: number = 2
): Array<ReadableStream> {

  // Check for readable stream
  if ( !stream.tee )
    throw new Error("Only readable streams can be split");

  // Decls
  let result: Array<ReadableStream>,
      cancelFns: Array<(?string) => void>,
      cancelAll: () => void;

  // Generate parts
  result = [stream];

  while ( parts > result.length ) {
    // Take last part
    let s: ReadableStream = result.pop();

    // Add new parts after tee'ing
    result = result.concat( s.tee() );
  }

  // Take cancel functions
  cancelFns = result.map( s => s.cancel.bind(s) );

  // Gen cancelAll
  cancelAll = () => cancelFns.forEach( c => c() );

  // Add cancelAll to all the parts
  result.forEach( s => {
    s.cancelAll = cancelAll;
  });

  return result;
}

// Browserify compat
if ( typeof module !== "undefined" )
  // $FlowFixMe
  module.exports = split;
