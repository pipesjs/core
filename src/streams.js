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

export type ReadableStreamController = {
  desiredSize: number,
  close: () => void,
  enqueue: (mixed) => mixed,
  error: (string | Error) => void
};

export const
  ReadableStream = interfaces.ReadableStream,
  WritableStream = interfaces.WritableStream,
  ByteLengthQueuingStrategy = interfaces.ByteLengthQueuingStrategy,
  CountQueuingStrategy = interfaces.CountQueuingStrategy,
  TransformStream = interfaces.TransformStream;

export default interfaces;
