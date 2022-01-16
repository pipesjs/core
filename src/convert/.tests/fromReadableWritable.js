import inspect from "inspect.macro";

import { consume, makeEagerReadable as makeReadable } from "../../test_utils";

import { pipe, EOS } from "../../core";
import { fromReadableWritable } from "../";

test("fromReadableWritable", async () => {
  const a = pipe((x) => x + 10);
  const p = fromReadableWritable({
    readable: a.readable,
    writable: a.writable,
  });

  const readable = makeReadable([2, 3, 4, 5, EOS, 6, 7, 8, 9, 10]);

  const transformed = readable.pipeThrough(p);
  const reader = transformed.getReader();
  const result = await consume(reader);

  expect(result).toStrictEqual([12, 13, 14, 15]);
});
