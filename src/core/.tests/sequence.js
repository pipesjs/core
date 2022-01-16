import { consume, makeReadable } from "../../../../../test/utils";
import { makePromise } from "../../../utils";
import { sequence, pipe } from "../";

test("Sequence", async () => {
  const p = pipe(function (i) {
    const [promise, resolve] = makePromise();
    setTimeout(() => resolve(i), i * 100);
    return promise;
  });

  const s = sequence();

  const readable = makeReadable([1, 2, 3]);

  const transformed = readable.pipeThrough(p).pipeThrough(s);
  const reader = transformed.getReader();

  const result = await consume(reader);

  expect(result).toStrictEqual([1, 2, 3]);
});
