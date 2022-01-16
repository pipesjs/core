import { Arrow } from "crocks";
import { TransformStream, ReadableStream } from "web-streams-polyfill";

import { consume, makeReadable } from "../../test_utils";
import { pipe, Pipe, EOS } from "../";

test("PipeIsArrow", async () => {
  const p = pipe((x) => x + 10);

  expect(p instanceof Arrow);
});

test("PipeComposition", async () => {
  const a = pipe((x, b, c) => x + 10);
  const b = pipe((x) => x + 15);

  const p = a.compose(b);

  const readable = makeReadable([2, 3, 4, 5]);

  const transformed = readable.pipeThrough(p);
  const reader = transformed.getReader();

  const result = await consume(reader);

  expect(result).toStrictEqual([27, 28, 29, 30]);
});

test("PipeContramap", async () => {
  const a = pipe((x) => x + 10);
  const p = a.contramap((x) => 8 * x);

  const readable = makeReadable([2, 3, 4, 5]);

  const transformed = readable.pipeThrough(p);
  const reader = transformed.getReader();

  const result = await consume(reader);

  expect(result).toStrictEqual([26, 34, 42, 50]);
});

test("PipePromap", async () => {
  const a = pipe((x) => x + 10);
  const p = a.promap(
    (x) => 4 + x,
    (x) => 10 * x
  );

  const readable = makeReadable([2, 3, 4, 5]);

  const transformed = readable.pipeThrough(p);
  const reader = transformed.getReader();

  const result = await consume(reader);

  expect(result).toStrictEqual([160, 170, 180, 190]);
});

test("PipeId", async () => {
  let countA = 0;
  let countB = 0;
  let countP = 0;

  const a = pipe((x, b, c) => x + 10);
  const b = Pipe.id();

  const p = a.compose(b);

  const runWithA = a.runWith.bind(a);
  const runWithB = a.runWith.bind(a);
  const runWithP = a.runWith.bind(a);

  a.runWith = (...args) => {
    countA += 1;
    return runWithA(...args);
  };
  b.runWith = (...args) => {
    countB += 1;
    return runWithB(...args);
  };
  p.runWith = (...args) => {
    countP += 1;
    return runWithP(...args);
  };

  const readable = makeReadable([2, 3, 4, 5]);

  const transformed = readable.pipeThrough(p);
  const reader = transformed.getReader();

  const result = await consume(reader);

  expect(countA).toStrictEqual(0);
  expect(countB).toStrictEqual(0);
  expect(countP).toStrictEqual(4);

  expect(result).toStrictEqual([12, 13, 14, 15]);
});

test("PipeTransformData", async () => {
  const p = pipe((x) => x + 10);
  const p1 = pipe((x) => x + 15, { init: 1 });

  const readable1 = makeReadable([2, 3, 4, 5]);
  const readable2 = makeReadable([2, 3, 4, 5]);

  const transformed1 = readable1.pipeThrough(p1);
  const transformed2 = readable2.pipeThrough(p);
  const reader1 = transformed1.getReader();
  const reader2 = transformed2.getReader();

  const result1 = await consume(reader1);
  const result2 = await consume(reader2);

  expect(p instanceof TransformStream);
  expect(p1 instanceof TransformStream);

  expect(result1).toStrictEqual([16, 17, 18, 19, 20]);
  expect(result2).toStrictEqual([12, 13, 14, 15]);
});

test("PipePutEOS", async () => {
  const p = pipe((x) => x + 10);

  const readable = new ReadableStream({
    start(controller) {
      for (let i = 2; i <= 5; i++) {
        controller.enqueue(i);
      }

      controller.enqueue(EOS);

      for (let i = 6; i <= 10; i++) {
        controller.enqueue(i);
      }

      controller.close();
    },
  });

  const transformed = readable.pipeThrough(p);
  const reader = transformed.getReader();
  const result = await consume(reader);

  expect(result).toStrictEqual([12, 13, 14, 15]);
});
