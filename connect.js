"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._connect = undefined;
exports.default = connect;

var _streams = require("./streams");

var _utils = require("./utils");

/**
 * This function takes any number of `transform streams` with an optional `readable` at the head and a `writable` at the tail.
 * It connects them together by applying `pipeThrough` recursively and returns the resulting `readable` that acts as a composition of the input `streams`.
 *
 * In case, a `writable` is passed at the tail, the resulting `readable` is `pipeTo`d and the resulting `promise` is returned.
 *
 * @example
 * let readable = createReadable(),
 *   writable = createWritable(),
 *   passThrough = pipe( k => k );
 *
 * let promise = connect( readable, passThrough, writable );   // 1, 2, 3
 */
function connect(origin) {

  // Check origin
  if (!origin) throw new Error("No streams passed");

  var sink = void 0,
      end = void 0;

  // Get the last stream

  for (var _len = arguments.length, streams = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    streams[_key - 1] = arguments[_key];
  }

  sink = streams.pop();

  // if origin is a transform$, take it's readable part
  if (origin instanceof _streams.ReadableStream) {
    end = origin;
  } else {
    end = origin.readable;
  }

  // Connect the streams
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = streams[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var stream = _step.value;


      // Check for transform streams
      if (!(0, _utils.isTransform)(stream)) throw new Error("Only transform streams allowed in the center");

      // piping through a transform returns it's readable part
      end = end.pipeThrough(stream);
    }

    // Handle sink
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if ((0, _utils.isWritable)(sink)) end = end.pipeTo(sink);else if ((0, _utils.isTransform)(sink)) end = end.pipeThrough(sink);else throw new Error("Only writable and transform streams allowed at the end.");

  // Return result
  return end;
}

// FIXME: Internal flow.js resolution problem workaround


var _connect = exports._connect = connect;
connect._connect = connect;

// Browserify compat
if (typeof module !== "undefined")
  // $FlowFixMe
  module.exports = connect;