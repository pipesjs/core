// ./src/shared/pipes/convert/readable/.tests/fromNodeReadable.js

import { _, it } from "param.macro";

import from$ from "from2";
import { ReadableStream } from "web-streams-polyfill";

import { makeWritable } from "../../../test_utils";
import { fromNodeReadable } from "../";

function string$(string, objectMode) {
  let stream;
  stream = from$({ objectMode }, function (size, next) {
    // if there's no more content
    // left in the string, close the stream.
    if (string.length <= 0) return setTimeout(stream.destroy(_), 0);

    // Pull in a new chunk of text,
    // removing it from the string.
    var chunk = string.slice(0, 1);
    string = string.slice(1);

    // Emit "chunk" from the stream.
    next(null, chunk);
  });
  return stream;
}

test("fromNodeReadable bytes", async () => {
  const result = [];
  const str = "hello world";
  const node$ = string$(str);
  const writable = makeWritable(result);
  const readable = fromNodeReadable(node$);

  await readable.pipeTo(writable);

  const out = Array.from(result[0]).map(String.fromCharCode(_)).join("");

  expect(out).toStrictEqual(str);
});

test("fromNodeReadable obj", async () => {
  const result = [];
  const str = "hello world";
  const node$ = string$(str, true);
  const writable = makeWritable(result);
  const readable = fromNodeReadable(node$);

  await readable.pipeTo(writable);

  const out = result.join("");

  expect(out).toStrictEqual(str);
});
