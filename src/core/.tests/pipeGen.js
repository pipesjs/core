
import { consume, makeReadable } from "../../test_utils";
import { pipeGen } from "../";

test("PipeGen", async () => {
  const p = pipeGen(function* (i) {
    yield i;
    yield i;
  });

  const readable = makeReadable([1, 1, 1]);

  const transformed = readable.pipeThrough(p);
  const reader = transformed.getReader();

  const result = await consume(reader);

  expect(result).toStrictEqual([1, 1, 1, 1, 1, 1]);
});
