// @flow
// ./src/shared/pipes/convert/writable/fromNodeWritable.js

import type { Writable as NodeWritable } from "stream";
import { _, it } from "param.macro";

import { isArrayBuffer, isBuffer, isString, isTypedArray } from "lodash";
import { WritableStream } from "web-streams-polyfill";

import { invariant, promiseEvent, promiseFlag } from "../../internal/utils";

export const inObjectMode =
  it.writableObjectMode || it._writableState.objectMode;

// $FlowFixMe
export const isWritableToBytes = (chunk) =>
  [isArrayBuffer, isBuffer, isString, isTypedArray].map(_(chunk)).some(it);

export const fromNodeWritable = (
  nodeWritable: NodeWritable
): WritableStream<any> =>
  new WritableStream({
    start(controller) {
      nodeWritable.on("error", controller.error(_));

      return Promise.race([
        // $FlowFixMe
        promiseFlag(!nodeWritable.writableFinished),
        nodeWritable.writable || promiseEvent(nodeWritable, "drain"),
      ]);
    },
    write(chunk) {
      invariant(
        inObjectMode(nodeWritable) || isWritableToBytes(chunk),
        "Byte stream can only accept Buffer, TypedArray or string values"
      );

      const shouldContinue = nodeWritable.write(chunk);

      return shouldContinue
        ? Promise.resolve()
        : promiseEvent(nodeWritable, "drain");
    },
    close: () => (nodeWritable.uncork(), nodeWritable.end()),
    abort: nodeWritable.destroy(_),
  });

export default fromNodeWritable;
