// @flow
// ./src/shared/pipes/convert/readable/fromMediaStream.js

import { _, it } from "param.macro";

import { ReadableStream } from "web-streams-polyfill";

import { patchRecorder } from "../../internal/utils";

export type MediaRecorderOptions = {
  mimeType: string,
  audioBitsPerSecond: number,
  videoBitsPerSecond: number,
  bitsPerSecond: number,
};

const DEFAULT_OPTS: $Shape<MediaRecorderOptions> = {
  mimeType: "audio/webm;codecs=opus",
  audioBitsPerSecond: 48000,
};

export const fromMediaStream = (
  mediaStream: any,
  opts: $Shape<MediaRecorderOptions> = DEFAULT_OPTS
): ReadableStream<any> => {
  const MediaRecorder = patchRecorder();
  if (MediaRecorder.notSupported)
    throw new Error("MediaRecorder not supported in this environment");

  const readable: ReadableStream<any> = new ReadableStream({
    start(controller) {
      const recorder = new MediaRecorder(mediaStream, opts);

      recorder.ondataavailable = controller.enqueue(_.data);
      recorder.onerror = controller.error(_);
      recorder.onstop = controller.close(_);
    },
  });

  return readable;
};

export default fromMediaStream;
