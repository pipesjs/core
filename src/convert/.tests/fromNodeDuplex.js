// ./src/shared/pipes/readable/.tests/fromNodeDuplex.js

import { _, it } from "param.macro";

import through from "through2";

import { makeReadable, makeWritable } from "../../test_utils";
import { fromNodeDuplex } from "../";

test("fromNodeDuplex", async () => {
  const stream = through.obj((a, enc, cb) => cb(null, a));
  const p = fromNodeDuplex(stream);

  const readable = makeReadable([1, 2, 3, 4, 5]);
  const transformed = readable.pipeThrough(p);

  const result = [];
  const writable = makeWritable(result);

  await transformed.pipeTo(writable);

  expect(result).toStrictEqual([1, 2, 3, 4, 5]);
});
