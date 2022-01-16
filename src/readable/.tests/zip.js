import { consume, makeReadable } from "../../../../../test/utils";
import { zip } from "../";

test("zip", async () => {
  const a = makeReadable([1, 2]);
  const b = makeReadable([1, 2]);
  const c = makeReadable([1, 2]);

  const transformed = zip([a, b, c]);
  const reader = transformed.getReader();

  const result = await consume(reader);

  expect(result).toStrictEqual([
    [1, 1, 1],
    [2, 2, 2],
  ]);
});
