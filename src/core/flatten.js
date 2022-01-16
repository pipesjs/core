// @flow
// ./src/core/flatten.js

import { _, it } from "param.macro";

import type { Pipe, PipeOpts } from "./pipe";
import pipe from "./pipe";

export default function flatten<A>(
  opts: $Shape<PipeOpts<any>> = {}
): Pipe<Array<A>, ?A> {
  return pipe(
    // $FlowFixMe
    (chunk, controller) => void (chunk && chunk.forEach(controller.enqueue(_))),
    opts
  );
}

export { flatten };
