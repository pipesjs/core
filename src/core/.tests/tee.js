// ./src/shared/pipes/core/.tests/tee.js

import { TransformStream } from "web-streams-polyfill";

import { makeReadable, makeWritable } from "../../../../../test/utils";
import { pipe, tee } from "../";

test("tee", async () => {
  const readable = makeReadable([1, 1, 1]);
  const [r1, r2, r3] = tee(readable);

  const t1 = pipe((a) => a);
  const t2 = pipe((a) => a + 1);
  const t3 = pipe((a) => a + 2);

  const [a1, a2, a3] = [[], [], []];
  const [w1, w2, w3] = [a1, a2, a3].map(makeWritable);

  await Promise.all([
    r1.pipeThrough(t1).pipeTo(w1),
    r2.pipeThrough(t2).pipeTo(w2),
    r3.pipeThrough(t3).pipeTo(w3),
  ]);

  expect(a1).toStrictEqual([1, 1, 1]);
  expect(a2).toStrictEqual([2, 2, 2]);
  expect(a3).toStrictEqual([3, 3, 3]);
});

test("tee_pipe", async () => {
  const r1 = makeReadable([1, 1, 1]);
  const r2 = makeReadable([2, 2, 2]);
  const r3 = makeReadable([3, 3, 3]);

  const t = pipe((a) => a + 1);
  const [t1, t2, t3] = tee(t);

  const [a1, a2, a3] = [[], [], []];
  const [w1, w2, w3] = [a1, a2, a3].map(makeWritable);

  await Promise.all([
    r1.pipeThrough(t1).pipeTo(w1),
    r2.pipeThrough(t2).pipeTo(w2),
    r3.pipeThrough(t3).pipeTo(w3),
  ]);

  expect(a1).toStrictEqual([1 + 1, 1 + 1, 1 + 1]);
  expect(a2).toStrictEqual([2 + 1, 2 + 1, 2 + 1]);
  expect(a3).toStrictEqual([3 + 1, 3 + 1, 3 + 1]);
});

test("tee_transformstream_fail", async () => {
  const t0 = new TransformStream({ transform: (a) => a });

  try {
    const [a, b] = tee(t0);
    expect(false).toBe(true); // Should not run
  } catch (e) {
    return;
  }

  expect(false).toBe(true); // Should not run
});
