import { consume, makeReadable } from "../../../../../test/utils";
import { accumulate } from "../";

test("pipes.core.accumulate", async () => {
  const a = accumulate();

  const readable = makeReadable([1, 1, 1]);

  const transformed = readable.pipeThrough(a);
  const reader = transformed.getReader();

  const result = await consume(reader);

  expect(result).toStrictEqual([[1, 1, 1]]);
});
