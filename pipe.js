"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pipe;

var _utils = require("./utils");

var _pipeAsync = require("./pipeAsync");

var _pipeAsync2 = _interopRequireDefault(_pipeAsync);

var _pipeFn = require("./pipeFn");

var _pipeFn2 = _interopRequireDefault(_pipeFn);

var _pipeGen = require("./pipeGen");

var _pipeGen2 = _interopRequireDefault(_pipeGen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// pipe :: Function | Generator Function -> Opts {} -> TransformBlueprint
// pipe takes any normal/generator func and returns transform stream blueprint.
//
// pipe.async :: Async Function -> Opts {} -> TransformBlueprint
// pipe.async takes any async func and returns transform stream blueprint.
//

function pipe(fn, opts) {
  var blueprint = void 0;

  // Route to appropriate function
  if ((0, _utils.isGeneratorFn)(fn)) blueprint = (0, _pipeGen2.default)(fn, opts);else if ((0, _utils.isFunction)(fn)) blueprint = (0, _pipeFn2.default)(fn, opts);else throw new Error("Invalid argument");

  // Return Transform blueprint if not instance
  if (this instanceof pipe) return new blueprint();else return blueprint;
}

// Add async support
pipe.async = _pipeAsync2.default;

// Browserify compat
if (typeof module !== "undefined") module.exports = pipe;