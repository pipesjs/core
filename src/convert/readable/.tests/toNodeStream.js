// ./src/shared/pipes/convert/readable/.tests/fromNodeReadable.js

import { _, it } from "param.macro";

import { makeReadable } from "../../../test_utils";
import { makePromise } from "../../../internal/utils";
import { toNodeStream } from "../";

test("toNodeStream", async () => {
  const str = "hello world";
  const readable = makeReadable(str.split(""));
  const result = [];
  const node$ = toNodeStream(readable);
  const [done, finish] = makePromise();

  node$.on("close", finish);
  node$.on("data", result.push(_));

  await done;

  const out = result.join("");
  expect(out).toStrictEqual(str);
});
