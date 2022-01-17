// ./src/react/hooks/useReader.js

import { it, _ } from "param.macro";

import { useEffect, useMemo } from "react";

import { invariant } from "../../internal/utils";

const getReader = (readable) => (
  invariant(!readable.locked, "reader already exists"), readable.getReader()
);

export const useReader = (readable) => {
  const reader =
    (() => readable && getReader(readable)) |> useMemo(_, [readable]);

  const releaseReader = async () => (
    invariant(readable.locked, "reader does not exist"),
    //
    // Need to be enqueued as a microtask since there might be
    // pending reads on the reader.
    await Promise.resolve(),
    reader.releaseLock()
  );

  // On component unmount, close reader
  useEffect(
    () => () => void (reader && reader._ownerReadableStream && reader.cancel()),
    [reader]
  );

  if (!reader) return reader;

  return [reader, releaseReader];
};

export default useReader;
