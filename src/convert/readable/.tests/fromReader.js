// ./src/shared/pipes/convert/readable/.tests/fromReader.js

import { ReadableStream } from "web-streams-polyfill";

import { makeReadable, makeWritable } from "../../../test_utils";
import { fromReader } from "../";

test("fromReader", async () => {
  const input = [1, 2, 3, 4, 5];
  const result = [];
  const inputReadable = makeReadable(input);
  const readable = fromReader(inputReadable.getReader());
  const writable = makeWritable(result);

  await readable.pipeTo(writable);
  expect(result).toStrictEqual(input);
});
