// ./src/shared/utils/.tests/yc.js

import { yc } from "../";

test("yc", () => {
  const fac = (n) => (n < 2 ? 1 : fac(n - 1) * n);
  const yFac = (recur) => (n) => n < 2 ? 1 : recur(n - 1) * n;

  expect(fac(5)).toBe(yc(yFac)(5));
});
