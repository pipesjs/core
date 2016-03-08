"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pipeGen;

var _streams = require("./streams");

var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // pipeGen :: Generator Function -> Opts {} -> TransformBlueprint
// pipeGen takes a generator function and wraps it into
// a transform streams. Waits till completion, before enqueuing.
// All yields are enqueued, back-pressure is respected and
// the generator paused if queue getting back-pressured.
//
// Returns a blueprint class that can be used to
// instantiate above streams.
//

function pipeGen(fn) {
  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var
  // opts
  init = _ref.init;
  var readableStrategy = _ref.readableStrategy;
  var writableStrategy = _ref.writableStrategy;


  // Prepare transformer
  var transformer = {
    resume: null,
    liveGenerator: null,

    // Run function and enqueue result
    transform: function transform(chunk, enqueue, done) {
      // Create generator
      var self = transformer,
          stream = this,
          gen = fn(chunk);

      // Add to current gen
      self.liveGenerator = gen;

      // Create resume function
      self.resume = _utils.consumeGenWithBP.bind(null, stream.readable.controller, self.liveGenerator, done);

      return self.resume();
    },
    flush: function flush(enqueue, close) {
      var self = transformer;

      if (self.liveGenerator) (0, _utils.consumeGen)(self.liveGenerator, enqueue, close);else close();
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
      var stream = (_this = _possibleConstructorReturn(this, Object.getPrototypeOf(TransformBlueprint).call(this, transformer)), _this);

      // Bind transform function to stream
      transformer.transform = transformer.transform.bind(stream);

      // Wrap pull so that it can signal generator to resume
      var _pull = stream.readable.pull;
      stream.readable.pull = function (c) {
        var resume = transformer.resume;

        resume && resume();

        return _pull(c);
      };

      // If init, push chunk
      if (init !== void 0) stream.writable.write(init);

      return _ret = stream, _possibleConstructorReturn(_this, _ret);
    }

    return TransformBlueprint;
  }(_streams.TransformStream);

  return TransformBlueprint;
}