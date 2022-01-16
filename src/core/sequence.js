// @flow
// ./src/core/sequence.js

import type { Controller } from "web-streams-polyfill";

import { isUndefined } from "lodash";

import type { PipeOpts } from "./pipe";
import pipe, { Pipe } from "./pipe";

// Helper for using `Sequence` class
export default function sequence<A>(
  pipeOpts: $Shape<PipeOpts<any>> = {}
): Pipe<Promise<A>, ?A> {
  // Sequencing stream i.e. takes promise chunks and returns
  // awaited values on the other end, in order of arrival
  return pipe(
    (chunk, controller: ?Controller<any>) =>
      void (async () => {
        const val = await chunk;
        controller && !isUndefined(val) && controller.enqueue(val);
      })(),
    pipeOpts
  );
}

export { sequence };
