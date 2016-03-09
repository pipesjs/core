"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = flatten;

var _streams = require("./streams");

var _utils = require("./utils");

// flatten :: ReadableStream... -> ReadableStream
// flatten function takes one or more streams
// and returns a readable combining the streams,
// returning chunks as they arrive in combined streams.
//

function flatten() {
  for (var _len = arguments.length, streams = Array(_len), _key = 0; _key < _len; _key++) {
    streams[_key] = arguments[_key];
  }

  var flattenedStream = undefined,
      writers = [];

  return flattenedStream = new _streams.ReadableStream({
    start: function start(controller) {
      // Create writers for each stream
      while (writers.length < streams.length) {
        writers.push(new _streams.WritableStream({
          // write incoming to flattenedStream
          write: controller.enqueue.bind(controller)
        }));
      } // Connect streams to writers
      var connect = function connect(r, w) {
        return r.pipeTo(w);
      },
          pipedAll = undefined;

      try {
        pipedAll = (0, _utils.zipWith)(connect, streams, writers);
      } catch (e) {
        throw new Error("Only readable streams can be flattened.");
      }

      // Set up closing
      return Promise.all(pipedAll).then(controller.close.bind(controller), controller.error.bind(controller));
    },
    cancel: function cancel() {
      // If cancelled, cancel all streams
      streams.forEach(function (stream) {
        return stream.cancel();
      });
    }
  });
};