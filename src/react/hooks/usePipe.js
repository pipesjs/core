// @flow
// ./src/react/hooks/usePipe.js

import { _, it } from "param.macro";

import type {
  TransformStream,
  WritableStreamDefaultWriter as Writer,
} from "web-streams-polyfill";

import { useEffect } from "react";

import { compose, makePropTypeValidator } from "../../internal/utils";

import useReadable from "./useReadable";
import useWriter from "./useWriter";

const makeWrite = (writer) => (result) =>
  // $FlowFixMe
  result.either(writer.abort(_), writer.write(_));

export const _getWrite = <A>(writer: Writer<A>, propTypes: Object) =>
  compose(
    // Validator
    makePropTypeValidator(propTypes),
    //
    // Write fn
    makeWrite(writer)
  );

export const usePipe: <A, B>(
  TransformStream<A, B>,
  Object
) => [?(A) => void, ?B, ?Error] = ({ readable, writable }, attrs = {}) => {
  const [writer, releaseWriter] = useWriter(writable);

  // Subscribe to readable
  const [chunk, error] = useReadable(readable, attrs.output);

  // On component unmount, close pipe
  // $FlowFixMe
  useEffect(() => releaseWriter(_), [writer]);

  return [_getWrite(writer, attrs.input), chunk, error];
};

export default usePipe;
