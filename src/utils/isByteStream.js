// @flow
// ./src/utils/isByteStream.js

import { _, it } from "param.macro";

import { ReadableStream } from "web-streams-polyfill";

const getCtrl = it._readableStreamController;

const { constructor: ByteController } = getCtrl(
  new ReadableStream({ type: "bytes" })
);

export const isByteStream = (stream: ReadableStream<any>) =>
  getCtrl(stream) instanceof ByteController;

export default isByteStream;
