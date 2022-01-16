// ./src/shared/pipes/utils/.tests/passthrough.js

import { makeReadable, makeWritable } from "../../../../../test/utils";
import { passthrough } from "../";

const input = [1, 1, 1];
const output = [];

test("passthrough", async () => {
  const r = makeReadable(input);
  const w = makeWritable(output);

  await r.pipeThrough(passthrough()).pipeTo(w);

  expect(input).toStrictEqual(output);
});
