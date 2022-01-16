// @flow
// ./src/core/pipeGen.js

import type { Pipe, PipeOpts } from "./pipe";

import chain from "./chain";
import pipe from "./pipe";
import sequence from "./sequence";

function makeGenExhaust<A, B>(genFn: (A) => Generator<B, any, A>): (A) => any {
  return async (chunk, controller, isClosing = false) => {
    const gen: Generator<B, any, any> = genFn(chunk);

    while (true) {
      const { done, value } = gen.next(isClosing);
      if (done) {
        break;
      }

      controller && controller.enqueue(value);
    }
  };
}

// Helper for creating instances of `Pipe` class
export default function pipeGen<A, B>(
  genFn: (?A) => Generator<B, any, any>,
  pipeOpts: $Shape<PipeOpts<A>> = {}
): Pipe<A, B> {
  return chain(pipe(makeGenExhaust(genFn), pipeOpts), sequence());
}

export { pipeGen };
