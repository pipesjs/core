// connect :: Streams... -> Stream
// connect function takes one or more streams
// and sequentially pipes them to each other,
// returning the result of the last pipe operation.
//
// `ReadableStream::pipeThrough` is used to
// connect the streams.

export default function connect(origin, ...streams) {
  // Check for transform streams
  let
    pipeThrough,
    end = origin.readable || origin;

  for ( let stream of streams ) {

    // Null stream
    if ( !end )
      return end;

    // Extract piping function
    if ( end.pipeThrough ) {
      pipeThrough = end.pipeThrough.bind(end);

    } else if ( end.readable ) {
      pipeThrough = end.readable.pipeThrough.bind(end.readable);

    } else {
      throw new Error("Only readable and transform streams can be chained");

    }

    // Pipe streams into each other
    // If transform stream then pipe readable
    end = pipeThrough( stream );
  }

  return end;
}
