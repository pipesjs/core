"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // pipeGen :: Generator Function -> Opts {} -> TransformBlueprint
// pipeGen takes a generator function and wraps it into
// a transform streams. Waits till completion, before enqueuing.
// All yields are enqueued, back-pressure is respected and
// the generator paused if queue getting back-pressured.
//
// Returns a blueprint class that can be used to
// instantiate above streams.
//

exports.default = pipeGen;

var _streams = require("./streams");

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Manages generator object and consumes it
// while taking backpressure into account
var GenObjManager = function () {
  function GenObjManager(gen, enqueue, readable) {
    _classCallCheck(this, GenObjManager);

    var done = void 0,
        condEnqueue = function condEnqueue(v) {
      if (v !== void 0) enqueue(v);
    },
        promise = new Promise(function (resolve) {
      done = resolve;
    });

    // Add props
    Object.assign(this, {
      done: done, gen: gen, readable: readable, promise: promise,
      enqueue: condEnqueue,
      running: false
    });
  }

  // Access to readable stream controller


  _createClass(GenObjManager, [{
    key: "start",


    // Kick start the read loop
    value: function start() {
      if (this.running || !this.gen) return;

      // Start the loop
      this.running = true;
      this.tick();
    }
  }, {
    key: "pause",
    value: function pause() {
      this.running = false;
    }
  }, {
    key: "close",
    value: function close() {
      this.pause();

      // Close generator
      this.gen && this.gen.return();
      this.gen = null;

      // Call done
      this.done();
    }

    // Flush the gen and close

  }, {
    key: "flush",
    value: function flush() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      if (!this.gen) return;

      // Pause
      this.pause();

      // Read gen n times
      // passing it a true value to signal shutdown
      while (n--) {
        this.tick(true);
      } // Close the generator
      this.close();
    }
  }, {
    key: "tick",
    value: function tick(msg) {
      // Get next value
      var _gen$next = this.gen.next(msg),
          value = _gen$next.value,
          done = _gen$next.done;

      // Enqueue value to stream


      this.enqueue(value);

      // Process next tick
      if (done) {
        this.close();
      } else if (this.running && this.ready) {
        this.tick(msg);
      } else {
        this.pause();
      }
    }
  }, {
    key: "readableController",
    get: function get() {
      return this.readable._readableStreamController;
    }

    // Make manager a thenable

  }, {
    key: "then",
    get: function get() {
      return this.promise.then.bind(this.promise);
    }

    // Get backpressure signals

  }, {
    key: "ready",
    get: function get() {
      return this.readableController.desiredSize >= 0;
    }
  }]);

  return GenObjManager;
}();

function pipeGen(fn) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      init = _ref.init,
      readableStrategy = _ref.readableStrategy,
      writableStrategy = _ref.writableStrategy;

  // Prepare transformer
  var genManager = void 0,
      transformer = {
    transform: function transform(chunk, done, enqueue) {
      // Create generator manager
      var gen = fn(chunk);

      genManager = new GenObjManager(gen, enqueue, this.readable);

      // Set up closing
      genManager.then(function () {
        return done();
      });

      // Start consuming
      genManager.start();
    },
    flush: function flush(enqueue, close) {
      // Flush generator
      genManager && genManager.flush();
      close();
    },


    // if passed
    readableStrategy: readableStrategy,
    writableStrategy: writableStrategy
  };

  // Wrap in blueprint class

  var TransformBlueprint = function (_TransformStream) {
    _inherits(TransformBlueprint, _TransformStream);

    function TransformBlueprint() {
      var _this, _ret;

      _classCallCheck(this, TransformBlueprint);

      // Make stream
      var stream = (_this = _possibleConstructorReturn(this, (TransformBlueprint.__proto__ || Object.getPrototypeOf(TransformBlueprint)).call(this, transformer)), _this),
          _underlyingSource = stream.readable._readableStreamController._underlyingSource,
          writer = void 0;

      // Bind transform function to stream
      transformer.transform = transformer.transform.bind(stream);

      // Super hacky because TransformStream doesn't allow an easy way to do this
      // Wrap pull so that it can signal generator to resume
      var _pull = _underlyingSource.pull;
      _underlyingSource.pull = function (c) {

        // Resume generator manager
        genManager && genManager.start();

        return _pull(c);
      };

      // If init, push chunk
      if (init !== void 0) {
        writer = stream.writable.getWriter();
        writer.write(init);

        // Release lock so other writers can start writing
        writer.releaseLock();
      }

      return _ret = stream, _possibleConstructorReturn(_this, _ret);
    }

    return TransformBlueprint;
  }(_streams.TransformStream);

  return TransformBlueprint;
}

// Browserify compat
if (typeof module !== "undefined") module.exports = pipeGen;