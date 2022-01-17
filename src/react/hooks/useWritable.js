// @flow
// ./src/react/hooks/useWritable.js

import { it, _ } from "param.macro";

import type { WritableStream } from "web-streams-polyfill";

import { useCallback, useEffect } from "react";

import { _getWrite } from "./usePipe";
import useWriter from "./useWriter";

export const useWritable: <T>(WritableStream<T>, Object) => ?(T) => void = (
  writable,
  attrs = {}
) => {
  const [writer, releaseWriter] = useWriter(writable);

  // Create writer
  const write = useCallback(
    // Create write fn
    // $FlowFixMe
    _getWrite(writer, attrs.output || {}),
    [writer]
  );

  // On component unmount, close writable
  useEffect(
    // Return unsubscribe function
    // $FlowFixMe
    () => releaseWriter(_),
    [writer]
  );

  return write;
};

export default useWritable;
