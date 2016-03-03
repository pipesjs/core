// Access stream interface

let interfaces,
    global = global || {};

if ( typeof window !== 'undefined' )
  global = window;

if ( !!global.ReadableStream ) {

  interfaces = {
    ReadableByteStream:        global.ReadableByteStream,
    ReadableStream:            global.ReadableStream,
    WritableStream:            global.WritableStream,
    ByteLengthQueuingStrategy: global.ByteLengthQueuingStrategy,
    CountQueuingStrategy:      global.CountQueuingStrategy,
    TransformStream:           global.TransformStream
  };

} else {

  try {
    interfaces = require("web-streams-polyfill")["default"];

  } catch (e) {

    throw new Error("No Stream implementation found");
  }
}

export default interfaces;
