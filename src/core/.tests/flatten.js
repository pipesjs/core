import { consume, makeReadable } from "../../../../../test/utils";
import { flatten, pipe } from "../";

test("Flatten", async () => {
  const p = pipe((i) => [i, i]);
  const f = flatten();

  const readable = makeReadable([1, 1, 1]);

  const transformed = readable.pipeThrough(p).pipeThrough(f);
  const reader = transformed.getReader();

  const result = await consume(reader);

  expect(result).toStrictEqual([1, 1, 1, 1, 1, 1]);
});
