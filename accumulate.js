"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = accumulate;

var _streams = require("./streams");

var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } // accumulate :: Function -> InitValue -> { readable, writable }
// accumulate function takes a reducer function,
// and an optional inital value.
//
// Returns a readable, writable pair that consumes piped
// stream, combining the values with the reducer
// and enqueues the result.
//
// reducer :: PrevValue -> CurrValue -> NextValue
// reducer function gets:
//
// PrevValue: the previous value or InitValue (if supplied)
// CurrValue: the current value being processed.
//
// that returns NextValue which in turn becomes PrevValue
// for the next iteration until the input stream is
// entirely consumed.
//

var compatibilityError = "\n    accumulate takes a reducing function\n  ";

function accumulate(reducer, init) {
  // check if reducer is a function
  if (!(0, _utils.isFunction)(reducer)) throw new Error(compatibilityError);

  var ReadableWritable = function ReadableWritable() {
    _classCallCheck(this, ReadableWritable);

    // Init
    var result = init,
        readable = undefined,
        writable = undefined,
        done = undefined,
        resolved = undefined,
        rejected = undefined,
        cancelled = undefined;

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
        writable.close();

        // Resolve promise
        resolved(reason);
      }
    });

    // Return { readable, writable } pair
    Object.assign(this, {
      readable: readable, writable: writable
    });
  };

  // Return ReadableWritable blueprint


  return ReadableWritable;
}

// Browserify compat
if (typeof module !== "undefined") module.exports = accumulate;