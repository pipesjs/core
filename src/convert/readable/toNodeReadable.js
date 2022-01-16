// @flow
// ./src/shared/pipes/convert/readable/toNodeStream.js

import { Readable as NodeReadable } from "stream";
import { _, it } from "param.macro";

import type { ReadableStream } from "web-streams-polyfill";
import { once } from "lodash";

import { isByteStream, makePump } from "../../utils";

export const toNodeStream = (readable: ReadableStream<any>): NodeReadable =>
  new (class extends NodeReadable {
    constructor() {
      super({ objectMode: !isByteStream(readable) });

      const self = this;
      const pump = makePump(readable.getReader());

      // $FlowFixMe
      const destroy = once(self.destroy(_));

      // $FlowFixMe
      const gracefulDestroy = () => destroy();

      pump({
        error: destroy,
        enqueue: self.push(_),
        close: gracefulDestroy
      });
    }

    _read() {}
  })();

export default toNodeStream;
