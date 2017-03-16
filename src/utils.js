// Events
export class Events {
  constructor () {
    this._events = {};
  }

  trigger ( name, ...args ) {
    if ( name in this._events ) {
      // Trigger all handlers
      this._events[name].forEach( fn => fn(...args) );
    }
  }

  on ( name, fn ) {
    this._events[name] = this._events[name] || [];
    this._events[name].push( fn );
  }

  off ( name ) {
    this._events[name] = [];
  }
}

// Utils
export const
  events = new Events,

  isTransform = s => s && s.writable && s.readable,
  isReadable = s => s && s.pipeThrough,
  isWritable = s => s && s.getWriter,

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

// Generate uuids
// From: https://gist.github.com/jed/982883
export function uuid(a) {
  return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid);
}
