"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});


// Access stream interface

var interfaces = void 0,

// $FlowFixMe
global = global || {};

if (typeof window !== 'undefined') global = window;

if (!!global.ReadableStream) {

  interfaces = {
    ReadableStream: global.ReadableStream,
    WritableStream: global.WritableStream,
    ByteLengthQueuingStrategy: global.ByteLengthQueuingStrategy,
    CountQueuingStrategy: global.CountQueuingStrategy,
    TransformStream: global.TransformStream
  };
} else {

  try {
    interfaces = require("web-streams-polyfill");
    console.log(JSON.stringify(interfaces, null, 4));
  } catch (e) {

    throw new Error("No Stream implementation found");
  }
}

var ReadableStream = exports.ReadableStream = interfaces.ReadableStream,
    WritableStream = exports.WritableStream = interfaces.WritableStream,
    ByteLengthQueuingStrategy = exports.ByteLengthQueuingStrategy = interfaces.ByteLengthQueuingStrategy,
    CountQueuingStrategy = exports.CountQueuingStrategy = interfaces.CountQueuingStrategy,
    TransformStream = exports.TransformStream = interfaces.TransformStream;

exports.default = interfaces;

//*** Flow types


//*** Flow interfaces

;

;

;

;