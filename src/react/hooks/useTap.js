// @flow
// ./src/react/hooks/useTap.js

import { it, _ } from "param.macro";

import type { ReadableStream } from "web-streams-polyfill";

import { useEffect, useMemo, useState } from "react";

import type { FilterPredicate } from "../../utils/filter";

import { fork } from "../../readable";
import { pullChunks } from "./useReadable";
import useReader from "./useReader";

export const useTap = <T>(
  readable: ReadableStream,
  filter: FilterPredicate<T>,
  attrs: Object = {}
): [?T, ?Error, ?ReadableStream<T>] => {
  const [tapped, remainder] = useMemo(fork(readable, filter, _), [readable]);

  const [reader, releaseReader] = useReader(tapped);

  // Define state
  const [chunk, setChunk] = useState();
  const [error, setError] = useState(null);

  // On component unmount, close pipe
  useEffect(
    () => (
      pullChunks({
        attrs,
        reader,
        setChunk,
        setError,
      }),
      releaseReader
    ),
    [reader]
  );

  return [chunk, error, remainder];
};

export default useTap;
