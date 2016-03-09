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

// Zips together two arrays using given fn
export function zipWith( fn, arr1, arr2 ) {
  let res = [];

  // Pop values, push zipped values
  while ( arr1.length && arr2.length )
    res.push( fn( arr1.pop(), arr2.pop() ));

  return res;
}
