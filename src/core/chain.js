// @flow
// ./src/core/chain.js

import { it } from "param.macro";

import { TransformStream } from "web-streams-polyfill";

import fromReadableWritable from "../convert/fromReadableWritable";
import reverse from "../internal/reverse";
import passthrough from "../utils/passthrough";
import { Pipe } from "./pipe";

// $FlowFixMe
const isPipe = it instanceof Pipe;

function chainTwo<A, B, C>(
  inStream: Pipe<A, B> | TransformStream<A, B>,
  outStream: Pipe<B, C> | TransformStream<B, C>
): Pipe<A, ?B> {
  const in$ = isPipe(inStream) ? inStream : fromReadableWritable(inStream);
  const out$ = isPipe(outStream) ? outStream : fromReadableWritable(outStream);

  return out$.compose(in$);
}

export const chain = (
  ...streams: Array<TransformStream<any> | Pipe<any, any>>
): Pipe<any, any> => reverse(streams).reduce(chainTwo, passthrough());

export default chain;
