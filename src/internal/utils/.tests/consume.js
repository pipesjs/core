// ./src/shared/utils/.tests/consume.js

import { _, it } from "param.macro";

import { consume } from "../";

function* mkGen() {
  yield 1;
  yield* mkGen();
}

test("consume", () => {
  const result = consume(mkGen(), 3);
  expect(result).toStrictEqual([1, 1, 1]);
});
