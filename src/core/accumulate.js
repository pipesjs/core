// @flow
// ./src/core/accumulate.js

import type { Controller } from "web-streams-polyfill";
import { isUndefined } from "lodash";

import type { PipeOpts } from "./pipe";
import pipe, { Pipe } from "./pipe";

export default function accumulate<A>(
  pipeOpts: $Shape<PipeOpts<any>> = {}
): Pipe<A, ?Array<A>> {
  // Accumulating stream i.e. takes chunks and returns
  // collected values on the other end, after source is terminated

  const accumulated: Array<A> = [];
  const opts = { ...pipeOpts, trailing: true };

  return pipe(
    (chunk, controller: ?Controller<any>, closing: ?boolean) =>
      void (closing
        ? controller && controller.enqueue(accumulated)
        : isUndefined(chunk) || accumulated.push(chunk)),
    opts
  );
}

export { accumulate };
