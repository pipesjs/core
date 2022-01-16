// @flow
// ./src/shared/pipes/convert/readable/fromReader.js

import { _, it } from "param.macro";

import { ReadableStream } from "web-streams-polyfill";

import type { ReadableStreamDefaultReader as Reader } from "../../../types/web-streams-polyfill.flow";

import { makePump } from "../../utils";

export const fromReader = <T>(reader: Reader<T>): ReadableStream<T> =>
  new ReadableStream({
    start: makePump(reader)
  });

export default fromReader;
