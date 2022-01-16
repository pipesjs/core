import { TransformStream } from "web-streams-polyfill";

import { consume, makeReadable } from "../../test_utils";
import { pipe, chain } from "../";

test("PipeChain", async () => {
  const a = pipe((x) => x + 10);
  const b = pipe((x) => x - 10);
  const c = pipe((x) => x + 1);

  const p = chain(a, b, c);

  const readable = makeReadable([2, 3, 4, 5]);

  const transformed = readable.pipeThrough(p);
  const reader = transformed.getReader();

  const result = await consume(reader);

  expect(result).toStrictEqual([2 + 1, 3 + 1, 4 + 1, 5 + 1]);
});

test("PipeChainMixed", async () => {
  const a = new TransformStream({
    transform: (x, controller) => controller.enqueue(x + 10),
  });
  const b = pipe((x) => x - 15);
  const c = pipe((x) => x + 6);

  const p = chain(a, b, c);

  const readable = makeReadable([2, 3, 4, 5]);

  const transformed = readable.pipeThrough(p);
  const reader = transformed.getReader();

  const result = await consume(reader);

  expect(result).toStrictEqual([2 + 10, 3 + 10, 4 + 10, 5 + 10]);
});
