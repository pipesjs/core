// @flow
// ./src/shared/pipes/readable/fromReadableWritable.js

import { _, it } from "param.macro";

import type { ReadableWritable } from "web-streams-polyfill";
import { once } from "lodash";

import pipe, { Pipe } from "../core/pipe";
import { makePump } from "../utils";

export default function fromReadableWritable<A, B>({
  readable,
  writable
}: ReadableWritable<A, B>): Pipe<A, B> {
  const reader = readable.getReader();
  const writer = writable.getWriter();
  const startPump = once(makePump(reader));

  // $FlowFixMe
  return pipe(
    (chunk, controller, isClosing) => {
      startPump(controller);

      isClosing || writer.write(chunk);
    },
    { trailing: true }
  );
}

export { fromReadableWritable };
