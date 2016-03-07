// split :: ReadableStream -> Int -> [ReadableStream]
// split function takes a readable stream and number
// and returns an array of tee'd readable streams,
// with a `cancelAll` function that cancels all the tee'd
// streams and hence the original stream.
//

export default function split( stream, parts=2 ) {
  // Check for readable stream
  if ( !stream.tee )
    throw new Error("Only readable streams can be split");

  // Decls
  let result, cancelFns, cancelAll;

  // Generate parts
  result = [stream];

  while ( parts > result.length ) {
    // Take last part
    let s = result.pop();

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
