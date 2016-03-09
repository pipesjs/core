"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zipWith = zipWith;
exports.consumeGen = consumeGen;
exports.consumeGenWithBP = consumeGenWithBP;
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

function zipWith(fn, arr1, arr2) {
  var res = [];

  while (arr1.length && arr2.length) {
    res.push(fn(arr1.pop(), arr2.pop()));
  }return res;
}

function consumeGen(gen, enqueue, doneFn) {
  // Get value and signal generator to wind up

  var _gen$next = gen.next(true);

  var value = _gen$next.value;
  var done = _gen$next.done;

  controller.enqueue(value);

  if (done) return doneFn();

  // Keep consuming
  else return consumeGen(gen, enqueue, doneFn);
}

function consumeGenWithBP(controller, gen, doneFn) {
  // Check for back pressure
  // if desiredSize negative stop consuming
  if (controller.desiredSize <= 0) return;

  // Get value

  var _gen$next2 = gen.next();

  var value = _gen$next2.value;
  var done = _gen$next2.done;

  controller.enqueue(value);

  if (done) return doneFn();

  // Keep consuming
  else return consumeGenWithBP(controller, gen, doneFn);
}