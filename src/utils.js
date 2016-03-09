// Utils
export const
  isTransform = s => s && s.writable && s.readable,
  isReadable = s => s && s.pipeThrough,
  isWritable = s => s && s.write,

  // Inspired by code from @tj/co library
  isFunction = f => f && typeof f === "function",
  isGenerator = o => o && isFunction( o.next ),
  isGeneratorFn = ({ constructor }) => {
    return constructor && (
       constructor.name === "GeneratorFunction" ||
       constructor.displayName === "GeneratorFunction"
    );
  };

export function zipWith( fn, arr1, arr2 ) {
  let res = [];

  while ( arr1.length && arr2.length )
    res.push( fn( arr1.pop(), arr2.pop() ));

  return res;
}

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


