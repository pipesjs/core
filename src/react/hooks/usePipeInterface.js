// @flow
// ./src/react/hooks/usePipeInterface.js

import { _, it } from "param.macro";

import type { ReadableStream, TransformStream } from "web-streams-polyfill";

import { useMemo, useRef } from "react";

import { tee } from "../../core";
import { useTap, useReadable, useWritable } from ".";

export type PipeInterface<A, B> = {
  useTap: () => [?B, ?Error, ?ReadableStream<B>],
  useReadable: () => [B, Error],
  useWritable: () => (A) => void,
};

// FIXME: Works with vanilla transform streams but not with `pipe`s. :((
export function usePipeInterface<A, B>(
  { readable, writable }: TransformStream<A, B>,
  attrs: Object = {}
): PipeInterface<A, B> {
  const writableRef = useRef(writable);
  const readable1Ref = useRef();
  const readable2Ref = useRef();

  const pipeInterface = useMemo(
    () => (
      // $FlowFixMe
      ([readable1Ref.current, readable2Ref.current] = tee(readable)),
      {
        useReadable: () => useReadable(readable1Ref.current, attrs),
        useTap: (filter) => useTap(readable2Ref.current, filter, attrs),
        useWritable: () => useWritable(writableRef.current, attrs),
      }
    ),
    [] // Exec only once
  );

  return pipeInterface;
}

export default usePipeInterface;
