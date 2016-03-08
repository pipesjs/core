"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.split = exports.pipe = exports.merge = exports.flatten = exports.chain = exports.connect = undefined;

var _connect = require("./connect");

var _connect2 = _interopRequireDefault(_connect);

var _chain = require("./chain");

var _chain2 = _interopRequireDefault(_chain);

var _flatten = require("./flatten");

var _flatten2 = _interopRequireDefault(_flatten);

var _merge = require("./merge");

var _merge2 = _interopRequireDefault(_merge);

var _pipe = require("./pipe");

var _pipe2 = _interopRequireDefault(_pipe);

var _split = require("./split");

var _split2 = _interopRequireDefault(_split);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Exports
exports.connect = _connect2.default;
exports.chain = _chain2.default;
exports.flatten = _flatten2.default;
exports.merge = _merge2.default;
exports.pipe = _pipe2.default;
exports.split = _split2.default;

// Default exports

var fns = {
  connect: _connect2.default,
  chain: _chain2.default,
  flatten: _flatten2.default,
  merge: _merge2.default,
  pipe: _pipe2.default,
  split: _split2.default
};

exports.default = fns;