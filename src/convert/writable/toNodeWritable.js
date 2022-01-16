// @flow
// ./src/shared/pipes/convert/readable/toNodeStream.js

import { Writable as NodeWritable } from "stream";
import { _, it } from "param.macro";

import type { WritableStream } from "web-streams-polyfill";

// TODO: Write implementation
export const toNodeStream = (readable: WritableStream<any>): NodeWritable =>
  new (class extends NodeWritable {
    constructor() {
      throw new TypeError("Not Implemented");
    }

    _write() {}
  })();

export default toNodeStream;
