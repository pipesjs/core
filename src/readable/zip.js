// @flow
// ./src/readable/zip.js

import { _, it } from "param.macro";

import type Result from "crocks/Result";

import list from "@ygor/list";
import tryCatch from "crocks/Result/tryCatch";
import { defer } from "lodash";
import { ReadableStream } from "web-streams-polyfill";

import pipe from "../core/pipe";

function makeZipPump(fn, streams = []) {
  const readers = streams.map(it.getReader());

  const shouldRelease = Promise.race(readers.map(it.closed));
  const releaseAll = tryCatch(readers.forEach(it.releaseLock(), _));

  // $FlowFixMe
  shouldRelease.then(defer(releaseAll, _));

  return async function pump(controller) {
    // $FlowFixMe
    const available = streams.map(it._state).every(it === "readable");
    if (!available) return controller.close();

    const chunks = await list(readers).map(it.read());

    if (chunks.some(it.done)) {
      return controller.close();
    }

    const values = chunks.map(it.value);
    const result: Result = tryCatch(controller.enqueue(_(...values)))(fn);

    // $FlowFixMe
    result.either(controller.error(_), pump(controller, _));
  };
}

export default function zip<C>(
  streams: Array<ReadableStream<any>>,

  // $FlowFixMe
  combine: (...Array<any>) => C = (...args) => args
): ReadableStream<C> {
  const start = makeZipPump(combine, streams);

  const result: ReadableStream<C> = new ReadableStream({
    start,
  });

  // Normalize pipe behavior by piping through a passthrough
  return result.pipeThrough(pipe(it));
}

export { zip };
