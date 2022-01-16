// ./src/shared/pipes/readable/fromNodeDuplex.js

import { _, it } from "param.macro";

import { ReadableStream, WritableStream } from "web-streams-polyfill";

import { compose } from "../internal/utils";
import fromReadableWritable from "./fromReadableWritable";

export const toTransform = (duplex$) => {
  return {
    readable: new ReadableStream({
      start(controller) {
        duplex$.on("data", controller.enqueue(_));
        duplex$.on("error", controller.error(_));
      },
    }),

    writable: new WritableStream({
      start(controller) {
        duplex$.on("error", controller.error(_));
      },

      write(chunk) {
        duplex$.write(chunk);
      },
    }),
  };
};

export const fromNodeDuplex = compose(toTransform, fromReadableWritable);

export default fromNodeDuplex;
