// Utils
export const
  isTransform = s => s && s.writable && s.readable,
  isReadable = s => s && s.pipeThrough,
  isWritable = s => s && s.write;

export function consumeGen( gen, enqueue, doneFn ) {
  // Get value and signal generator to wind up
  let { value, done } = gen.next( true );
  controller.enqueue( value );

  if ( done )
    return doneFn();

  // Keep consuming
  else
    return consumeGen( gen, enqueue, doneFn );
}

export function consumeGenWithBP( controller, gen, doneFn ) {
  // Check for back pressure
  // if desiredSize negative stop consuming
  if ( controller.desiredSize <= 0 )
    return;

  // Get value
  let { value, done } = gen.next();
  controller.enqueue( value );

  if ( done )
    return doneFn();

  // Keep consuming
  else
    return consumeGenWithBP( controller, gen, doneFn );
}

