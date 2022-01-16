// ./src/shared/pipes/convert/writable/.tests/fromWriter.js

import { WritableStream } from "web-streams-polyfill";

import { makeReadable, makeWritable } from "../../../test_utils";
import { fromWriter } from "../";

test("fromWriter", async () => {
  const input = [1, 2, 3, 4, 5];
  const result = [];
  const readable = makeReadable(input);
  const outputWritable = makeWritable(result);
  const writable = fromWriter(outputWritable.getWriter());

  await readable.pipeTo(writable);
  expect(result).toStrictEqual(input);
});
