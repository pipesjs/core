// ./src/shared/pipes/convert/writable/.tests/fromNodeWritable.js

import inspect from "inspect.macro";
import { _, it } from "param.macro";

import { Writable as NodeWritable } from "stream";
import { WritableStream } from "web-streams-polyfill";

import { makeReadable } from "../../../test_utils";
import { makePromise } from "../../../internal/utils";
import { fromNodeWritable } from "../";

test("fromNodeWritable bytes", async () => {
  const input = "hello there pretty peoples".split(" ");
  const result = [];
  const [done, finish] = makePromise();

  const readable = makeReadable(input);
  const writable = fromNodeWritable(
    new NodeWritable({
      write: (c, e, cb) => (result.push(c), cb()),
    })
  );

  await readable.pipeTo(writable);

  expect(result.map(it.toString())).toStrictEqual(input);
});

test("fromNodeWritable", async () => {
  const input = [1, 2, 3, 4, 5];
  const result = [];
  const [done, finish] = makePromise();

  const readable = makeReadable(input);
  const writable = fromNodeWritable(
    new NodeWritable({
      objectMode: true,
      write: (c, e, cb) => (result.push(c), cb()),
    })
  );

  await readable.pipeTo(writable);

  expect(result).toStrictEqual(input);
});
