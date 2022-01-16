import { _, it } from "param.macro";

import Pred from "crocks/Pred";
import { TransformStream } from "web-streams-polyfill";

import { makeReadable, makeWritable } from "../../../../../test/utils";
import { filter } from "../";

test("filter", async () => {
  const readable = makeReadable([1, 2, 3, 4]);

  const container = [];
  const writable = makeWritable(container);

  await readable.pipeThrough(filter(!(it % 2))).pipeTo(writable);

  expect(container).toStrictEqual([2, 4]);
});

test("filter Pred", async () => {
  const readable = makeReadable([1, 2, 3, 4]);

  const container = [];
  const writable = makeWritable(container);

  const pred = new Pred(it % 2);

  await readable.pipeThrough(filter(pred)).pipeTo(writable);

  expect(container).toStrictEqual([1, 3]);
});
