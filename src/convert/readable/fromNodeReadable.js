// @flow
// ./src/shared/pipes/convert/readable/fromNodeReadable.js

import type { Readable as NodeReadable } from "stream";
import { _, it } from "param.macro";

import { once } from "lodash";
import { ReadableStream } from "web-streams-polyfill";

import { promiseEvent } from "../../internal/utils";

export const inObjectMode =
  it.readableObjectMode || it._readableState.objectMode;

export const fromNodeReadable = (
  nodeReadable: NodeReadable
): ReadableStream<any> =>
  new ReadableStream({
    type: inObjectMode(nodeReadable) ? void 0 : "bytes",
    start(controller) {
      const close = once(controller.close(_));

      nodeReadable.on("error", controller.error(_));
      nodeReadable.on("close", close);
      nodeReadable.on("end", close);

      inObjectMode(nodeReadable) &&
        nodeReadable.on("data", controller.enqueue(_));

      return Promise.race([
        promiseEvent(nodeReadable, "resume"),
        promiseEvent(nodeReadable, "readable"),
      ]);
    },
    pull(controller) {
      if (!inObjectMode(nodeReadable)) {
        controller.enqueue(nodeReadable.read());
      }

      return promiseEvent(nodeReadable, "readable");
    },
  });

export default fromNodeReadable;
