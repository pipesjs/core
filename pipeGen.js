"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pipeGen;

var _streams = require("./streams");

var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } // pipeGen :: Generator Function -> Opts {} -> ReadableWritableBlueprint
// pipeGen takes a generator function and wraps it into
// a transform streams. Waits till completion, before enqueuing.
// All yields are enqueued, back-pressure is respected and
// the generator paused if queue getting back-pressured.
//
// Returns a blueprint class that can be used to
// instantiate above streams.
//

var readyEvt = (0, _utils.uuid)();

// Pump function that runs the generator and adds produced values
// to the transform stream.
function pump(gen, controller, resolve) {

  // Clear queue
  _utils.events.off(readyEvt);

  // Check stream state
  var backpressure = controller.desiredSize <= 0;

  // Wait for backpressure to ease
  if (backpressure) {
    return _utils.events.on(readyEvt, function () {
      pump(gen, controller, resolve);
    });
  }

  // Ready? proceed

  var _gen$next = gen.next(),
      done = _gen$next.done,
      value = _gen$next.value;

  // Enqueue


  controller.enqueue(value);

  // Generator exhausted? resolve promise
  if (done) {
    return resolve && resolve();
  }

  // Else rinse, repeat
  return pump(gen, controller, resolve);
}

function pipeGen(fn) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      init = _ref.init,
      readableStrategy = _ref.readableStrategy,
      writableStrategy = _ref.writableStrategy;

  return function ReadableWritableBlueprint() {
    _classCallCheck(this, ReadableWritableBlueprint);

    // Init
    var readable = void 0,
        writable = void 0,
        readableReady = void 0,
        readableReady_resolve = void 0,
        readableController = void 0,
        cancelled = void 0;

    // create promise that awaits both streams to start
    readableReady = new Promise(function (resolve) {
      readableReady_resolve = resolve;
    });

    // writable
    writable = new _streams.WritableStream({
      start: function start() {
        return readableReady;
      },
      write: function write(chunk, controller) {
        var promise = void 0,
            _resolve = void 0;

        promise = new Promise(function (resolve) {
          _resolve = resolve;
        });

        // Start pump
        var gen = fn(chunk);
        pump(gen, readableController, _resolve);

        return promise;
      },
      close: function close() {
        readableController.close();
      }
    }, writableStrategy);

    // readable
    readable = new _streams.ReadableStream({
      start: function start(controller) {
        readableController = controller;

        // Signal writable to start
        readableReady_resolve();
      },
      pull: function pull() {
        _utils.events.trigger(readyEvt);
      },
      cancel: function cancel(reason) {
        // Close writable
        writable.abort();
      }
    }, readableStrategy);

    // If init, push chunk
    if (init !== void 0) {
      var writer = writable.getWriter();
      writer.write(init);

      // Release lock so other writers can start writing
      writer.releaseLock();
    }

    // Return { readable, writable } pair
    Object.assign(this, {
      readable: readable, writable: writable
    });
  };
}

// Browserify compat
if (typeof module !== "undefined") module.exports = pipeGen;