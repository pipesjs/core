// @flow

// Access stream interface

let interfaces,
    // $FlowFixMe
    global = global || {};

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

export const
  ReadableStream = interfaces.ReadableStream,
  WritableStream = interfaces.WritableStream,
  ByteLengthQueuingStrategy = interfaces.ByteLengthQueuingStrategy,
  CountQueuingStrategy = interfaces.CountQueuingStrategy,
  TransformStream = interfaces.TransformStream;

export default interfaces;

//*** Flow types
export type valueDone = { value: mixed, done: boolean};

export type ReadableWritable = {
  readable: ReadableStream,
  writable: WritableStream
};

export type Stream = (ReadableStream | WritableStream | ReadableWritable);

export type ReadableStrategy = {
  highWaterMark: number,
  size: (mixed) => number
};

export type WritableStrategy = ReadableStrategy;

export type Transformer = {
  transform: (chunk: mixed, controller: ReadableStreamController) => ?Promise<mixed>,
  _unfulfilledFutures: Array<Promise<mixed>>
};

//*** Flow interfaces
export interface ReadableStreamController {
  [string]: mixed,  // Catch-all (for implementation)
  desiredSize: number,
  close: () => void,
  enqueue: (mixed) => mixed,
  error: (string | Error) => void
};

export interface ReadableStreamReader {
  closed: Promise<mixed>,
  cancel: (string) => ?Promise<mixed>,
  read: () => Promise<valueDone>,
  releaseLock: () => void
};

export interface WritableStreamWriter {
  closed: Promise<mixed>,
  desiredSize: null | number,
  ready: Promise<mixed>,
  abort: (string) => ?Promise<mixed>,
  close: () => Promise<void>,
  write: (mixed) => Promise<void>,
  releaseLock: () => void
};

export interface TransformInterface {
  readable: ReadableStream,
  writable: WritableStream
};
