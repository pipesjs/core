"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = accumulate;

var _streams = require("./streams");

var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var compatibilityError = "\n    accumulate takes a reducing function\n  ";

/**
 * This function takes a reducer function and an optional initial value and
 * returns a transformstream that accumulates the values of any stream piped to it.
 *
 * @param {function} reducer a function that takes sequential values and reduces them
 *
 * @returns {TransformStream} a ReadableWritable that consumes piped
 * stream, combining the values with the reducer and enqueues the result.
 *
 * @example
 * let readable, accumulator, accumulated, total;
 *
 *   // Create streams
 *   readable = createTestReadable( [1,2,3] );
 *
 *   // Connect the streams
 *   accumulator = accumulate( (a, b) => a+b, 4 );
 *   accumulated = readable.pipeThrough( new accumulator );    // 10
 */
function accumulate(reducer, init) {
  // check if reducer is a function
  if (!(0, _utils.isFunction)(reducer)) throw new Error(compatibilityError);

  var ReadableWritableBlueprint = function ReadableWritableBlueprint() {
    _classCallCheck(this, ReadableWritableBlueprint);

    // Init
    var result = init,
        readable = void 0,
        writable = void 0,
        done = void 0,
        resolved = void 0,
        rejected = void 0,
        cancelled = false;

    // Create done promise
    done = new Promise(function (resolve, reject) {
      resolved = resolve;
      rejected = reject;
    });

    // writable
    writable = new _streams.WritableStream({
      start: function start(err) {
        // Reject if error
        done.catch(rejected);
      },
      write: function write(chunk) {
        // if init not passed, set result as chunk
        if (result === void 0) {
          result = chunk;
          return;
        }

        // else, reduce and set result
        result = reducer(result, chunk);
      },
      close: function close() {
        resolved(result);
      },


      abort: rejected
    });

    // readable
    readable = new _streams.ReadableStream({
      start: function start(controller) {

        // Chain enqueue and done
        var finished = done.then(
        // Enqueue value if stream not cancelled
        function (val) {
          if (!cancelled) controller.enqueue(val);
        }, controller.error.bind(controller));

        // Close when finished
        finished.then(controller.close.bind(controller));
      },
      cancel: function cancel(reason) {
        // Set flag
        cancelled = true;

        // Close writable
        writable && writable.close();

        // Resolve promise
        resolved(reason);
      }
    });

    // Return { readable, writable } pair
    Object.assign(this, {
      readable: readable, writable: writable
    });
  };

  // Return ReadableWritable blueprint if not instance


  if (this instanceof accumulate) return new ReadableWritableBlueprint();else return ReadableWritableBlueprint;
}

// Browserify compat
if (typeof module !== "undefined")
  // $FlowFixMe
  module.exports = accumulate;