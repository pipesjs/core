"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = zip;

var _streams = require("./streams");

var _merge2 = require("./merge");

var _pipe = require("./pipe");

var _pipe2 = _interopRequireDefault(_pipe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

/**
 * This function takes one or more streams and returns a readable combining
 * the streams such that it gathers chunks from all streams by  applying the
 * first chunk as a function to the rest and then pushes them onto the combined
 * stream, by waiting for all streams to have pushed a chunk.
 *
 * @example
 * let add = (a, b) => a + b,
 *   rFn = createReadable([add,add,add]),
 *   r1 = createReadable([1,2,3]),
 *   r2 = createReadable([4,5,6]),
 *   writable = createWritable(),
 *   zipped = zip(rFn,r1,r2);
 *
 * zipped.pipeTo( writable );   // 5, 7, 9
 */
function zip() {
  var applier = void 0,
      merged = void 0;

  // Merge streams
  merged = _merge2._merge.apply(undefined, arguments);

  // Create applier
  applier = new _pipe2.default(function (chunks) {
    var _chunks = _toArray(chunks),
        fn = _chunks[0],
        args = _chunks.slice(1);

    if (typeof fn !== "function") throw new Error("Value is not a function");

    return fn.apply(undefined, _toConsumableArray(args));
  });

  // return zipped stream
  return merged.pipeThrough(applier);
}

// Browserify compat
if (typeof module !== "undefined")
  // $FlowFixMe
  module.exports = zip;