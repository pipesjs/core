"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pipeAsync;

var _streams = require("./streams");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // pipeAsync :: Async Function -> Opts {} -> TransformBlueprint
// pipeAsync takes an async function and wraps it into
// a transform streams. Waits till completion, before enqueuing.
//
// Returns a blueprint class that can be used to
// instantiate above streams.
//

function pipeAsync(fn) {
  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var
  // opts
  init = _ref.init;
  var readableStrategy = _ref.readableStrategy;
  var writableStrategy = _ref.writableStrategy;


  // Prepare transformer
  var transformer = {
    // Store awaiting functions
    _unfulfilledFutures: [],

    // Run function and enqueue result
    transform: function transform(chunk, enqueue, done) {
      // Run async fn
      var self = transformer,
          future = fn(chunk),


      // Get index of current future
      findex = self._unfulfilledFutures.length;

      // Add to executing futures list
      self._unfulfilledFutures.push(future);

      // Proceed to enqueue
      future.then(enqueue, function () {
        // Signal error to stream
        throw new Error();
      })

      // Remove itself from the _unfulfilledFutures list
      .then(function () {
        return self._unfulfilledFutures.splice(findex, 1);
      }).done(done);

      return future;
    },
    flush: function flush(enqueue, close) {
      var self = transformer;

      // Check if anything is left
      Promise.all(self._unfulfilledFutures).then(function (vs) {
        return vs.map(enqueue);
      }).done(close);
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

      // If init, push chunk
      if (init !== void 0) stream.writable.write(init);

      return _ret = stream, _possibleConstructorReturn(_this, _ret);
    }

    return TransformBlueprint;
  }(_streams.TransformStream);

  return TransformBlueprint;
}