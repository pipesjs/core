// @flow
// ./src/hos/gate.js

import { _, it } from "param.macro";

import { ReadableStream } from "web-streams-polyfill";

export default function gate<P, A, B>(
  condStream: ReadableStream<P>,
  ifStream: ReadableStream<A>,
  elseStream: ReadableStream<B>,
  predicate: (P) => boolean = Boolean
): ReadableStream<A | B> {
  let condReader, ifReader, elseReader;

  return new ReadableStream({
    start(controller) {
      ifReader = ifStream.getReader();
      elseReader = elseStream.getReader();
      condReader = condStream.getReader();
    },

    async pull(controller) {
      const cond = await condReader.read();

      if (cond.done) {
        return controller.close();
      }

      const result = await (predicate(cond.value)
        ? ifReader
        : elseReader
      ).read();

      if (result.done) {
        return controller.close();
      }

      controller.enqueue(result.value);
    },
  });
}

export { gate };
