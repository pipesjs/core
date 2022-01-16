
import { makeReadable } from "../../test_utils";
import { pipe, connect } from "../";

import {
  ReadableStream,
  TransformStream,
  WritableStream,
} from "web-streams-polyfill";

test("PipeConnect", async () => {
  const transforms = [
    pipe((x) => x + 10),
    pipe((x) => x - 10),
    pipe((x) => x + 10),
    new TransformStream({
      transform: (x, controller) => controller.enqueue(x - 10),
    }),
    pipe((x) => x + 10),
    pipe((x) => x - 10),
  ];

  const readable = makeReadable([2, 3, 4, 5]);

  const result = [];
  const writable = new WritableStream({
    write: (chunk) => result.push(chunk),
  });

  await connect(readable, transforms, writable);

  expect(result).toStrictEqual([2, 3, 4, 5]);
});
