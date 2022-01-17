// ./src/react/hooks/useReadable.js

import { it, _ } from "param.macro";

import { get, isFunction } from "lodash";
import { useEffect, useMemo, useState } from "react";
import Renderer from "react-test-renderer";

import { makePropTypeValidator, yc } from "../../internal/utils";
import useReader from "./useReader";

const read = (left, right) => (result) => (result.either(left, right), result);

export const pullChunks = ({ attrs, reader, setChunk, setError }) =>
  // Start read loop
  yc((recur) => async () => {
    const { value, done } = await reader.read();
    if (done) return;

    Renderer.act(
      () =>
        void (
          value
          |> makePropTypeValidator(attrs.input || {})
          |> read(setError, setChunk)
        )
    );

    return recur();
  })();

export const useReadable = (readable, attrs = {}) => {
  // Define state
  const [chunk, setChunk] = useState();
  const [error, setError] = useState(null);

  const readerArr = useReader(readable);

  const reader = useMemo(
    () => readerArr && readerArr[0],
    [readerArr && readerArr.length]
  );

  (() => (
    // Start to pull chunks from reader
    (get(reader, "read") |> isFunction) &&
      pullChunks({ attrs, reader, setChunk, setError }),
    //
    // On component unmount, close readable
    () => reader && reader.cancel()
  )) |> useEffect(_, [reader]);

  return [chunk, error];
};

export default useReadable;
