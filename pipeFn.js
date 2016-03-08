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
  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var
  // opts
  init = _ref.init;
  var readableStrategy = _ref.readableStrategy;
  var writableStrategy = _ref.writableStrategy;


  // Prepare transformer
  var transformer = {
    // Run function and enqueue result

    transform: function transform(chunk, enqueue, done) {
      return enqueue(fn(chunk)) && done();
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