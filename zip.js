"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = zip;

var _merge = require("./merge");

var _merge2 = _interopRequireDefault(_merge);

var _pipe = require("./pipe");

var _pipe2 = _interopRequireDefault(_pipe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); } // zip :: ReadableStream... -> ReadableStream
// zip function takes one or more streams
// and returns a readable combining the streams,
// such that it gathers chunks from all streams
// applying the first chunk as a function to the rest
// and then pushes them onto the combined
// stream, by waiting for all streams to have pushed a chunk.
//

function zip() {
  var applier = undefined,
      merged = undefined;

  // Merge streams
  merged = _merge2.default.apply(undefined, arguments);

  // Create applier
  applier = (0, _pipe2.default)(function (chunks) {
    var _chunks = _toArray(chunks);

    var fn = _chunks[0];

    var args = _chunks.slice(1);

    return fn.apply(undefined, _toConsumableArray(args));
  });

  // return zipped stream
  return merged.pipeThrough(new applier());
}

// Browserify compat
if (typeof module !== "undefined") module.exports = zip;