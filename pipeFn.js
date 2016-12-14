"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pipeFn;

var _streams = require("./streams");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // pipeFn :: Function -> Opts {} -> TransformBlueprint
// pipeFn takes a function and wraps it into
// a transform streams.
// Returns a blueprint class that can be used to
// instantiate above streams.
//

function pipeFn(fn) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      init = _ref.init,
      readableStrategy = _ref.readableStrategy,
      writableStrategy = _ref.writableStrategy;

  // Prepare transformer
  var transformer = {
    // Run function and enqueue result
    transform: function transform(chunk, done, enqueue) {
      var v = fn(chunk);

      if (v !== void 0) enqueue(v);

      return done();
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
          writer = void 0;

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
if (typeof module !== "undefined") module.exports = pipeFn;