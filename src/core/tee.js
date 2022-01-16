// @flow
// ./src/core/tee.js

import { ReadableStream, TransformStream } from "web-streams-polyfill";

import { isTransform, isPipe } from "../internal/utils/predicates";
import invariant from "../internal/utils/invariant";

import passthrough from "../utils/passthrough";

type TeeStream<T> = ReadableStream<T> | TransformStream<T, any>;
type TeeGenerator<T> = Generator<TeeStream<T>, void, void> & {
  [string | number]: TeeStream<T>,
};

export default function* tee<A>(input: TeeStream<A>): TeeGenerator<A> {
  const isPlainTransform = isTransform(input) && !isPipe(input);
  invariant(!isPlainTransform, "Plain `TransformStream`s are not tee-able");

  // $FlowFixMe
  if (isPipe(input)) {
    // $FlowFixMe
    yield input.compose(passthrough());

    // $FlowFixMe
    yield* tee(input);

    return;
  }

  if (input instanceof ReadableStream) {
    const readable = input;
    const [r1, r2] = readable.tee();

    yield r1;

    // $FlowFixMe
    yield* tee(r2);

    return;
  }

  throw new Error("Not a valid stream");
}

export { tee };
