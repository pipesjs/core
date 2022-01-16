// @flow
// ./src/shared/pipes/convert/readable/fromWriter.js

import { _, it } from "param.macro";

import { WritableStream } from "web-streams-polyfill";

import type { WritableStreamDefaultWriter as Writer } from "../../../types/web-streams-polyfill.flow";

export type FromWriterOpts = {
  preventAbort: boolean,
  preventClose: boolean
};

export const fromWriter = <T>(
  writer: Writer<T>,
  opts: FromWriterOpts = {}
): WritableStream<T> =>
  new WritableStream({
    write: writer.write(_),
    abort: () => !opts.preventAbort && writer.abort(),
    // $FlowFixMe
    close: () => !opts.preventClose && writer.close()
  });

export default fromWriter;
