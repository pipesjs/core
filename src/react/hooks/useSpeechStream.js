// ./src/react/hooks/useSpeechStream.js

import { _, it } from "param.macro";

import { useEffect, useMemo, useState } from "react";

import { fromReader } from "../../convert/readable";

export const useSpeechStream = (readable, sttClient, stt) => {
  if (!sttClient) {
    throw new Error("No stt client passed");
  }

  const [outReadable, setReadable] = useState();

  const responseReaderP =
    (() => readable && sttClient.speechToText(readable))
    |> useMemo(_, [readable, sttClient]);

  // (() => (
  //   responseReaderP && responseReaderP.then(r => setReadable(r)), // fromReader(r))),
  //   void 0
  // )) |> useEffect(_, [!!responseReaderP]);

  const then = useMemo(
    () => responseReaderP && responseReaderP.then.bind(responseReaderP),
    [!!responseReaderP]
  );

  // window.gaga = [then, stt, 2];

  return outReadable;
};

export default useSpeechStream;
