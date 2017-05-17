"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = split;

var _streams = require("./streams");

function split(stream) {
  var parts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;


  // Check for readable stream
  if (!stream.tee) throw new Error("Only readable streams can be split");

  // Decls
  var result = void 0,
      cancelFns = void 0,
      cancelAll = void 0;

  // Generate parts
  result = [stream];

  while (parts > result.length) {
    // Take last part
    var s = result.pop();

    // Add new parts after tee'ing
    result = result.concat(s.tee());
  }

  // Take cancel functions
  cancelFns = result.map(function (s) {
    return s.cancel.bind(s);
  });

  // Gen cancelAll
  cancelAll = function cancelAll() {
    return cancelFns.forEach(function (c) {
      return c();
    });
  };

  // Add cancelAll to all the parts
  result.forEach(function (s) {
    s.cancelAll = cancelAll;
  });

  return result;
}

// split :: ReadableStream -> Int -> [ReadableStream]
// split function takes a readable stream and number
// and returns an array of tee'd readable streams,
// with a `cancelAll` function that cancels all the tee'd
// streams and hence the original stream.
//