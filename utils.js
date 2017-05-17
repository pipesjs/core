"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isGeneratorFn = exports.isGenerator = exports.isFunction = exports.isWritable = exports.isReadable = exports.isTransform = exports.events = exports.Events = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.zipWith = zipWith;
exports.uuid = uuid;

var _streams = require("./streams");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Events
var Events = exports.Events = function () {
  function Events() {
    _classCallCheck(this, Events);

    this._events = {};
  }

  _createClass(Events, [{
    key: "trigger",
    value: function trigger(name) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (name in this._events) {
        // Trigger all handlers
        this._events[name].forEach(function (fn) {
          return fn.apply(undefined, args);
        });
      }
    }
  }, {
    key: "on",
    value: function on(name, fn) {
      this._events[name] = this._events[name] || [];
      this._events[name].push(fn);
    }
  }, {
    key: "off",
    value: function off(name) {
      this._events[name] = [];
    }
  }]);

  return Events;
}();

// Utils


var events = exports.events = new Events(),
    isTransform = exports.isTransform = function isTransform(s) {
  return s && s.writable && s.readable;
},
    isReadable = exports.isReadable = function isReadable(s) {
  return s instanceof _streams.ReadableStream && s.pipeThrough;
},
    isWritable = exports.isWritable = function isWritable(s) {
  return s instanceof _streams.WritableStream && s.getWriter;
},


// Inspired by code from @tj/co library
isFunction = exports.isFunction = function isFunction(f) {
  return typeof f === "function";
},
    isGenerator = exports.isGenerator = function isGenerator(o) {
  return o && isFunction(o.next);
},
    isGeneratorFn = exports.isGeneratorFn = function isGeneratorFn(_ref) {
  var constructor = _ref.constructor;

  return constructor && (constructor.name === "GeneratorFunction" || constructor.displayName === "GeneratorFunction");
};

// Zips together two arrays using given fn
function zipWith(fn, arr1, arr2) {

  var res = [];

  // Pop values, push zipped values
  while (arr1.length && arr2.length) {
    res.push(fn(arr1.pop(), arr2.pop()));
  }return res;
}

// Generate uuids
// From: https://gist.github.com/jed/982883
function uuid(a) {
  // $FlowFixMe
  return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
}