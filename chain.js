"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = chain;

var _connect2 = require("./connect");

var _utils = require("./utils");

var compatibilityError = "\n    Only transform streams and readable-writable pairs can be chained\n  ";

/**
 * This function takes one or more transform streams / { readable, writable } pairs
 * connects them to each other. Then takes the readable of the end and the writable
 * of the head and returns the { readable, writable } pair that is
 * compatible with `ReadableStream::pipeThrough`.
 *
 * @example
 * // Pure funtion example
 * let negator = pipe( n => -n ),
 *   doubler = pipe( n => 2*n ),
 *   composed = chain( new negator, new doubler ),
 *   rIn = createReadable(),
 *   rOut;
 *
 * rOut = rIn.pipeThrough( composed );  // -2, -4, -6
 */


function chain(origin) {

  // Check that origin is a transform stream / { readable, writable }
  if (!(0, _utils.isTransform)(origin)) throw new Error(compatibilityError);

  // connect the streams

  for (var _len = arguments.length, streams = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    streams[_key - 1] = arguments[_key];
  }

  var writable = origin.writable,
      readable = _connect2._connect.apply(undefined, [origin].concat(streams));

  // Check if null stream
  if (!(0, _utils.isReadable)(readable)) throw new Error(compatibilityError);

  // return readable-writable pair
  return {
    readable: readable,
    writable: writable
  };
}

// Browserify compat
if (typeof module !== "undefined")
  // $FlowFixMe
  module.exports = chain;