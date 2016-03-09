"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zipWith = zipWith;
// Utils
var isTransform = exports.isTransform = function isTransform(s) {
  return s && s.writable && s.readable;
},
    isReadable = exports.isReadable = function isReadable(s) {
  return s && s.pipeThrough;
},
    isWritable = exports.isWritable = function isWritable(s) {
  return s && s.write;
},


// Inspired by code from @tj/co library
isFunction = exports.isFunction = function isFunction(f) {
  return f && typeof f === "function";
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