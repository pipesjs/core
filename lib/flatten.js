"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = flatten;

var _streams = require("./streams");

function flatten() {
  for (var _len = arguments.length, streams = Array(_len), _key = 0; _key < _len; _key++) {
    streams[_key] = arguments[_key];
  }

  var readers = undefined,
      chunkWaiters = undefined,
      mergedStream = undefined;

  // Get readers
  try {
    readers = streams.map(function (stream) {
      return stream.getReader();
    });

    // Check for transform streams
  } catch (e) {

    throw new Error("Only ReadableStreams can be flattened");
  }

  return mergedStream = new _streams.ReadableStream({
    start: function start(controller) {
      // await chunks
      chunkWaiters = readers.map(function (r) {
        return r.read();
      });

      // Function for enqueuing chunks
      var enqueueAndReplace = function enqueueAndReplace(i) {
        return function (chunk) {
          // Push chunk to stream
          controller.enqueue(chunk);

          // Replace itself in the waiters
          var newPromise = readers[i].read();
          chunkWaiters[i] = newPromise.then(enqueueAndReplace(i),

          // error handling
          controller.error.bind(controller));

          return chunk;
        };
      };

      // Add replacement hooks
      chunkWaiters.map(function (promise, i) {

        return promise.then(enqueueAndReplace(i), controller.error.bind(controller));
      });
    },
    pull: function pull(controller) {
      // The first promise to resolve
      // pushes chunk on to the queue
      // and frees the stream to pull again.
      return Promise.race(chunkWaiters);
    },
    cancel: function cancel() {
      // If cancelled, cancel all streams
      streams.forEach(function (stream) {
        return stream.cancel();
      });
    }
  });
} // flatten :: ReadableStream... -> ReadableStream
// flatten function takes one or more streams
// and returns a readable combining the streams,
// returning chunks as they arrive in combined streams.
//

;