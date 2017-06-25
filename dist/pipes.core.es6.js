let interfaces;
let global = global || {};
if ( typeof window !== 'undefined' )
  global = window;
if ( !!global.ReadableStream ) {
  interfaces = {
    ReadableStream:            global.ReadableStream,
    WritableStream:            global.WritableStream,
    ByteLengthQueuingStrategy: global.ByteLengthQueuingStrategy,
    CountQueuingStrategy:      global.CountQueuingStrategy,
    TransformStream:           global.TransformStream
  };
} else {
  try {
    interfaces = require("web-streams-polyfill");
    console.log( JSON.stringify(interfaces,null,4));
  } catch (e) {
    throw new Error("No Stream implementation found");
  }
}
const ReadableStream = interfaces.ReadableStream;
const WritableStream = interfaces.WritableStream;
const TransformStream = interfaces.TransformStream;

const EOS         = Symbol.for("pipe.eos");
class Events {
  constructor () {
    this._events = {};
  }
  trigger ( name        , ...args               ) {
    if ( name in this._events ) {
      this._events[name].forEach( fn => fn(...args) );
    }
  }
  on ( name        , fn        ) {
    this._events[name] = this._events[name] || [];
    this._events[name].push( fn );
  }
  off ( name         ) {
    this._events[name] = [];
  }
}
const events         = new Events;
const isTransform                      =
    s => s && s.writable && s.readable;
const isReadable                      =
    s => s instanceof ReadableStream && s.pipeThrough;
const isWritable                      =
    s => s instanceof WritableStream && s.getWriter;
const isFunction                     =
    f => typeof f === "function";
const isGenerator                             =
    o => o && isFunction( o.next );
const isGeneratorFn                                      =
  ({ constructor }) => {
    return constructor && (
       constructor.name === "GeneratorFunction" ||
       constructor.displayName === "GeneratorFunction"
    );
  };
function zipWith            (
  fn                , arr1           , arr2
)            {
  let res            = [];
  while ( arr1.length && arr2.length )
    res.push( fn( arr1.pop(), arr2.pop() ));
  return res;
}
function uuid(a         )         {
  return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid);
}

const compatibilityError          = `
    accumulate takes a reducing function
  `;
function accumulate(reducer                         , init        ) {
  if ( !isFunction( reducer ))
    throw new Error( compatibilityError );
  class ReadableWritableBlueprint {
    constructor() {
      let
        result         = init,
        readable                 , writable                 ,
        done                , resolved                 , rejected                 ,
        cancelled          = false;
      done = new Promise( ( resolve, reject ) => {
        resolved = resolve;
        rejected = reject;
      });
      writable = new WritableStream({
        start( err        )       {
          done.catch( rejected );
        },
        write( chunk        )       {
          if ( result === void 0 ) {
            result = chunk;
            return;
          }
          result = reducer( result, chunk );
        },
        close()       {
          resolved( result );
        },
        abort: rejected
      });
      readable = new ReadableStream({
        start( controller                           )       {
          let finished                 = done.then(
            (val       ) => {
              if ( !cancelled )
                controller.enqueue( val );
            },
            controller.error.bind( controller )
          );
          finished.then( controller.close.bind( controller ));
        },
        cancel( reason          )       {
          cancelled = true;
          writable && writable.close();
          resolved( reason );
        }
      });
      Object.assign( this, {
        readable, writable
      });
    }
  }
  if ( this instanceof accumulate )
    return new ReadableWritableBlueprint;
  else
    return ReadableWritableBlueprint;
}
if ( typeof module !== "undefined" )
  module.exports = accumulate;

function connect(
    origin                                   ,
    ...streams
)                                  {
  if ( !origin )
    throw new Error("No streams passed");
  let sink                                 ,
      end;
  sink = streams.pop();
  if ( origin instanceof ReadableStream ) {
    end = origin;
  } else {
    end = origin.readable;
  }
  for ( let stream                   of streams ) {
    if ( !isTransform( stream ))
      throw new Error("Only transform streams allowed in the center");
    end = end.pipeThrough( stream );
  }
  if ( isWritable( sink ))
    end = end.pipeTo( sink );
  else if ( isTransform( sink ))
    end = end.pipeThrough( sink );
  else
    throw new Error("Only writable and transform streams allowed at the end.");
  return end;
}
const _connect = connect;
connect._connect = connect;
if ( typeof module !== "undefined" )
  module.exports = connect;

const compatibilityError$1         = `
    Only transform streams and readable-writable pairs can be chained
  `;
function chain(
    origin                  , ...streams
)                   {
  if ( !isTransform( origin ))
    throw new Error( compatibilityError$1 );
  const
    { writable } = origin,
    readable = _connect( origin, ...streams );
  if ( !isReadable( readable ))
    throw new Error( compatibilityError$1 );
  return {
    readable,
    writable
  };
}
if ( typeof module !== "undefined" )
  module.exports = chain;

function flatten(...streams                       )                 {
  let
    flattenedStream                ,
    writers                        = [];
  return flattenedStream = new ReadableStream({
    start (controller                          )                 {
      while ( writers.length < streams.length )
        writers.push( new WritableStream({
            write: controller.enqueue.bind( controller )
          })
        );
      let
        connect                                                     =
          (r, w) => r.pipeTo( w ),
        pipedAll;
      try {
        pipedAll = zipWith( connect, streams, writers );
      } catch (e) {
        throw new Error("Only readable streams can be flattened.");
      }
      return Promise.all( pipedAll ).then(
        controller.close.bind( controller ),
        controller.error.bind( controller )
      );
    },
    cancel ()       {
      streams.forEach( stream => stream.cancel() );
    }
  });
}
if ( typeof module !== "undefined" )
  module.exports = flatten;

function parseResults (results                   )            {
  let
    ended          = false,
    values               = [];
  for ( let result             of results ) {
    if ( result == null ) break;
    let { value, done } = result;
    ended = ended || done;
    values.push( value );
  }
  return {
    value: values,
    done: ended
  };
}
function merge(...streams                       )                 {
  let readers                             ,
      mergedStream                ,
      merger;
  try {
    readers = streams.map( (stream                ) => stream.getReader());
  } catch (e) {
    throw new Error("Only ReadableStreams can be flattened")
  }
  merger = controller => {
    let
      promises                             = readers.map( r => r.read() ),
      merged                     ,
      push;
    push = (obj           )             => {
      let { value, done } = obj;
      if ( done )
        return controller.close();
      controller.enqueue( value );
      return obj;
    };
    merged = Promise.all( promises )
      .then( parseResults )
      .then( push, controller.error.bind( controller ));
    return merged;
  };
  return mergedStream = new ReadableStream({
    start: merger,
    pull: merger,
    cancel ()       {
      streams.forEach( stream => stream.cancel() );
    }
  });
}

merge._merge = merge;
if ( typeof module !== "undefined" )
  module.exports = merge;

function pipeAsync ( fn         , {
    init, readableStrategy, writableStrategy
  }
   ={} )                     {
  let transformer              = {
    _unfulfilledFutures: [],
    transform ( chunk       , controller                           )                  {
      let
        future = fn( chunk ),
        condEnqueue = v => {
          if ( v === EOS ) {
              controller.close();
              return;
          }
          if ( v !== void 0 )
            controller.enqueue( v );
        },
        findex         = transformer._unfulfilledFutures.length;
      transformer._unfulfilledFutures.push( future );
      future
        .then( condEnqueue, () => {
          throw new Error
        })
        .then( () => transformer._unfulfilledFutures.splice( findex, 1 ) );
      return future;
    },
    flush ( controller ) {
      let condEnqueue = v => {
        if ( v !== void 0 )
          controller.enqueue( v );
      };
      Promise.all( transformer._unfulfilledFutures )
        .then( (vs              ) => vs.map( condEnqueue ));
    },
    readableStrategy,
    writableStrategy
  };
  class TransformBlueprint extends TransformStream                               {
    constructor () {
      let
        stream                  = super( transformer ),
        writer;
      if ( init !== void 0 ) {
        writer = stream.writable.getWriter();
        writer.write( init );
        writer.releaseLock();
      }
      return stream;
    }
  }
  if ( this instanceof pipeAsync )
    return new TransformBlueprint;
  else
    return TransformBlueprint;
}

function pipeFn ( fn       , {
    init, readableStrategy, writableStrategy
  }
   ={} )                     {
  let transformer              = {
    _unfulfilledFutures: [],
    transform ( chunk       , controller                           ) {
      let v        = fn( chunk );
      if ( v === EOS ) {
        controller.close();
        return;
      }
      if ( v !== void 0 )
        controller.enqueue( v );
    },
    readableStrategy,
    writableStrategy
  };
  class TransformBlueprint extends TransformStream                               {
    constructor () {
      let
        stream                  = super( transformer ),
        writer;
      if ( init !== void 0 ) {
        writer = stream.writable.getWriter();
        writer.write( init );
        writer.releaseLock();
      }
      return stream;
    }
  }
  return TransformBlueprint;
}

const readyEvt         = uuid();
const closedProp         = uuid();
function pump (
    gen                          ,
    controller                          ,
    resolve         )         {
  events.off( readyEvt );
  let backpressure          = controller.desiredSize <= 0;
  if ( backpressure ) {
    return events.on( readyEvt, () => {
      pump( gen, controller, resolve );
    });
  }
  let
    step = controller[closedProp] ? gen.return(true) : gen.next(false),
    { done, value } = step;
  if ( value === EOS ) {
    controller.close();
    done = true;
  } else {
    controller.enqueue( value );
  }
  if ( done ) {
    return resolve && resolve();
  }
  return pump( gen, controller, resolve );
}
function pipeGen ( fn                                   , {
    init, readableStrategy, writableStrategy
  }
   ={} ) {
  return class ReadableWritableBlueprint                               {
    constructor() {
      let
        readable                ,
        writable                ,
        readableReady                 ,
        readableReady_resolve       ,
        readableController;
      readableReady = new Promise( resolve => {
        readableReady_resolve = resolve;
      });
      writable = new WritableStream({
        start() {
          return readableReady;
        },
        write( chunk, controller ) {
          let promise                 , _resolve;
          promise = new Promise( resolve => {
            _resolve = resolve;
          });
          let gen = fn( chunk );
          pump( gen, readableController, _resolve );
          return promise;
        },
        close() {
          try {
            readableController.close();
          } catch (e) {
            if ( e instanceof TypeError ) {
            } else {
              throw e;
            }
          } finally {
            readableController[closedProp] = true;
          }
        }
      }, writableStrategy );
      readable = new ReadableStream({
        start( controller ) {
          readableController = controller;
          readableController[closedProp] = false;
          readableReady_resolve();
        },
        pull() {
          events.trigger( readyEvt );
        },
        cancel( reason ) {
          writable._write.close();
          readableController[closedProp] = true;
        }
      }, readableStrategy );
      if ( init !== void 0 ) {
        let writer                       = writable.getWriter();
        writer.write( init );
        writer.releaseLock();
      }
      this.readable = readable;
      this.writable = writable;
    }
  }
}

function pipe ( fn, opts ) {
  let blueprint;
  if ( isGeneratorFn( fn ))
    blueprint = pipeGen( fn, opts );
  else if ( isFunction( fn ))
    blueprint = pipeFn( fn, opts );
  else
    throw new Error("Invalid argument");
  if ( this instanceof pipe )
    return new blueprint;
  else
    return blueprint;
}
pipe.async = pipeAsync;
pipe.eos = EOS;
if ( typeof module !== "undefined" )
  module.exports = pipe;

function split(
  stream                , parts         = 2
)                        {
  if ( !stream.tee )
    throw new Error("Only readable streams can be split");
  let result                       ,
      cancelFns                          ,
      cancelAll;
  result = [stream];
  while ( parts > result.length ) {
    let s                 = result.pop();
    result = result.concat( s.tee() );
  }
  cancelFns = result.map( s => s.cancel.bind(s) );
  cancelAll = () => cancelFns.forEach( c => c() );
  result.forEach( s => {
    s.cancelAll = cancelAll;
  });
  return result;
}
if ( typeof module !== "undefined" )
  module.exports = split;

try {
  require("babel-polyfill");
} catch (e) {
  console.error("babel-polyfill not loaded. " + e.toString() );
}
const fns = {
  accumulate,
  connect,
  chain,
  flatten,
  merge,
  pipe,
  split
};
if ( typeof window !== "undefined")
  Object.assign( window, {
    Pipes: fns
  });

export { accumulate, connect, chain, flatten, merge, pipe, split };export default fns;
