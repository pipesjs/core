// @flow
// ./src/core/connect.js

import type {
  ReadableStream,
  TransformStream,
  WritableStream,
} from "web-streams-polyfill";
import chain from "./chain";

export default function connect<A, B, C>(
  inStream: ReadableStream<A>,
  transformStreams: Array<TransformStream<B, C>>,
  outStream: WritableStream<C>
): Promise<void> {
  return inStream.pipeThrough(chain(...transformStreams)).pipeTo(outStream);
}

export { connect };
