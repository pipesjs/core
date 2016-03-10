"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = chain;

var _connect = require("./connect");

var _connect2 = _interopRequireDefault(_connect);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// chain :: TransformStreams... -> { readable, writable }
// chain function takes one or more
// transform streams / { readable, writable } pairs
// connects them to each other,
// takes the readable of the end and the writable of the head,
// returns the { readable, writable } pair that is
// compatible with `ReadableStream::pipeThrough`
//

var compatibilityError = "\n    Only transform streams and readable-writable pairs can be chained\n  ";

function chain(origin) {

  // Check that origin is a transform stream / { readable, writable }
  if (!(0, _utils.isTransform)(origin)) throw new Error(compatibilityError);

  // connect the streams

  for (var _len = arguments.length, streams = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    streams[_key - 1] = arguments[_key];
  }

  var writable = origin.writable;
  var readable = _connect2.default.apply(undefined, [origin].concat(streams));

  // Check if null stream
  if (!(0, _utils.isReadable)(readable)) throw new Error(compatibilityError);

  // return readable-writable pair
  return {
    readable: readable,
    writable: writable
  };
}

// Browserify compat
if (typeof module !== "undefined") module.exports = chain;