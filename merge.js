"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._merge = undefined;
exports.default = merge;

var _streams = require("./streams");

// Parses arrays of {value, done} pairs to final pair
function parseResults(results) {
  var ended = false,
      values = [];

  // Accumulate values
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = results[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var result = _step.value;

      if (result == null) break;

      var value = result.value,
          done = result.done;

      ended = ended || done;
      values.push(value);
    }
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

  return {
    value: values,
    done: ended
  };
}

/**
 * This function takes one or more streams and returns a readable combining
 * the streams, such that it gathers chunks from all streams into an array and
 * then pushes them onto the combined stream, by waiting for all streams to
 * have pushed a chunk.
 *
 * @example
 * let r1 = createReadable([1,2,3]),
 *   r2 = createReadable([4,5,6,7]),
 *   writable = createWritable(),
 *   merged = merge(r1,r2);
 *
 * merged.pipeTo( writable );   // [1,4], [2,5], [3,6]
 */

function merge() {
  for (var _len = arguments.length, streams = Array(_len), _key = 0; _key < _len; _key++) {
    streams[_key] = arguments[_key];
  }

  var readers = void 0,
      mergedStream = void 0,
      merger = void 0;

  // Get readers
  try {
    readers = streams.map(function (stream) {
      return stream.getReader();
    });

    // Check for transform streams
  } catch (e) {

    throw new Error("Only ReadableStreams can be flattened");
  }

  // Merging function
  merger = function merger(controller) {
    var
    // Get read promises
    promises = readers.map(function (r) {
      return r.read();
    }),
        merged = void 0,
        push = void 0;

    // Read values and push them onto the stream
    push = function push(obj) {
      var value = obj.value,
          done = obj.done;


      if (done) return controller.close();

      controller.enqueue(value);
      return obj;
    };

    // Combine values into an array
    merged = Promise.all(promises).then(parseResults).then(push, controller.error.bind(controller));

    return merged;
  };

  return mergedStream = new _streams.ReadableStream({
    start: merger,
    pull: merger,

    cancel: function cancel() {
      // If cancelled, cancel all streams
      streams.forEach(function (stream) {
        return stream.cancel();
      });
    }
  });
};

// FIXME: Internal flow.js resolution problem workaround
var _merge = exports._merge = merge;
merge._merge = merge;

// Browserify compat
if (typeof module !== "undefined")
  // $FlowFixMe
  module.exports = merge;