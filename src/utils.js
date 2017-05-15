// @flow

import type { Stream, ReadableWritable } from "./streams";
import { ReadableStream, WritableStream } from "./streams";

// Events
export type anyFn = (...vals: Array<mixed>) => mixed;
export type asyncFn = (...vals: Array<mixed>) => Promise<mixed>;

export class Events {
  _events: { [string]: Array<anyFn> }
  constructor () {
    this._events = {};
  }

  trigger ( name: string, ...args: Array<mixed> ) {
    if ( name in this._events ) {
      // Trigger all handlers
      this._events[name].forEach( fn => fn(...args) );
    }
  }

  on ( name: string, fn: anyFn ) {
    this._events[name] = this._events[name] || [];
    this._events[name].push( fn );
  }

  off ( name: string ) {
    this._events[name] = [];
  }
}

// Utils
export const
  events: Events = new Events,

  isTransform: (Stream) => boolean =
    s => s && s.writable && s.readable,

  isReadable: (Stream) => boolean =
    s => s instanceof ReadableStream && s.pipeThrough,

  isWritable: (Stream) => boolean =
    s => s instanceof WritableStream && s.getWriter,

  // Inspired by code from @tj/co library
  isFunction: (mixed) => boolean =
    f => typeof f === "function",

  isGenerator: ({next: anyFn}) => boolean =
    o => o && isFunction( o.next ),

  isGeneratorFn: ({ constructor: anyFn }) => boolean =
  ({ constructor }) => {
    return constructor && (
       constructor.name === "GeneratorFunction" ||
       constructor.displayName === "GeneratorFunction"
    );
  };

// Zips together two arrays using given fn
export function zipWith<T1, T2, T3>(
  fn: (T1, T2) => T3, arr1: Array<T1>, arr2: Array<T2>
): Array<T3> {

  let res: Array<T3> = [];

  // Pop values, push zipped values
  while ( arr1.length && arr2.length )
    res.push( fn( arr1.pop(), arr2.pop() ));

  return res;
}

// Generate uuids
// From: https://gist.github.com/jed/982883
export function uuid(a: ?number): string {
  // $FlowFixMe
  return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid);
}
