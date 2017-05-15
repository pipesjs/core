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
export type ReadableStreamController = {
  desiredSize: number,
  close: () => void,
  enqueue: (mixed) => mixed,
  error: (string | Error) => void
};

export type ReadableStreamReader = {
  closed: boolean,
  cancel: (string) => void,
  read: () => Promise<valueDone>,
  releaseLock: () => void
};
