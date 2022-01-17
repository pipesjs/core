// @flow
// ./src/react/hooks/useWriter.js

import { it, _ } from "param.macro";

import type {
  WritableStream,
  WritableStreamDefaultWriter as Writer
} from "web-streams-polyfill";

import { useEffect, useMemo } from "react";

export const useWriter: <T>(
  WritableStream<T>,
  Object
) => [Writer<T>, () => void] = writable => {
  const writer = useMemo(writable.getWriter(_), [writable]);
  const releaseWriter = writer.releaseLock(_);

  // On component unmount, close writable
  useEffect(
    // Return unsubscribe function
    // $FlowFixMe
    () => writer.close(_),
    [writer]
  );

  return [writer, releaseWriter];
};

export default useWriter;
