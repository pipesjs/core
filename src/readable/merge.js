// @flow
// ./src/readable/merge.js

import { it } from "param.macro";

import list from "@ygor/list";
import { ReadableStream } from "web-streams-polyfill";

import { makePump } from "../utils";

export default function merge(
  streams: Array<ReadableStream<any>>
): ReadableStream<any> {
  const readers = streams.map(it.getReader());
  const pumps = readers.map(makePump);

  const result: ReadableStream<any> = new ReadableStream({
    async start(controller) {
      await list(pumps).map(it(controller));
      controller.close();
    },
  });

  return result;
}

export { merge };
