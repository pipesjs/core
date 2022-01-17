import { _, it } from "param.macro";
import { ReadableStream } from "web-streams-polyfill";

import { consume } from "../../test_utils";
import { makePromise } from "../../internal/utils";
import { gate } from "../";

const isSubsetOf = it.every(_.includes(_));

test("gate", async () => {
  const [[sp, sr], [ap, ar], [bp, br]] = [null, null, null].map(makePromise);
  let S, A, B;
  const s = new ReadableStream({
    start(c) {
      S = c;
      sr();
    },
  });
  const a = new ReadableStream({
    start(c) {
      A = c;
      ar();
    },
  });
  const b = new ReadableStream({
    start(c) {
      B = c;
      br();
    },
  });

  const g = gate(s, a, b);

  await Promise.all([sp, ap, bp]);

  // ------------> // [S], [A], [B]
  S.enqueue(true); // [true], [], []

  B.enqueue(1); // [true], [], [1]
  A.enqueue(2); // [true], [2], [1]

  A.enqueue(3); // [true, false], [2, 3], [1]
  B.enqueue(4); // [true, false], [2, 3], [1, 4]

  S.enqueue(false);

  S.close();

  const result = await consume(g.getReader());

  expect(result).toStrictEqual([2, 1]);
});
