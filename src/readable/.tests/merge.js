
import { consume, makeReadable } from "../../test_utils";
import { merge } from "../";

test("merge", async () => {
  const a = makeReadable([1, 2]);
  const b = makeReadable([1, 2]);
  const c = makeReadable([1, 2]);

  const transformed = merge([a, b, c]);
  const reader = transformed.getReader();

  const result = await consume(reader);

  expect(result.length).toStrictEqual(6);
});
