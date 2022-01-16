// @flow
// ./src/core/pipe.js

import { _, it } from "param.macro";

import type {
  Controller,
  QueuingStrategy,
  Transformer,
} from "web-streams-polyfill";

// $FlowFixMe
import { classes } from "polytype";

import defaultProps from "crocks/helpers/defaultProps";
import Pair from "crocks/Pair";
import { isUndefined } from "lodash";
import { TransformStream } from "web-streams-polyfill";

import { Arrow } from "../internal/structs/base/crocks";
import makePromise from "../internal/utils/makePromise";
import PatchCrock from "../internal/utils/PatchCrock";

// Declare useful symbols
const NONE: Symbol = Symbol("No initial value");

// EOS is the stream analog for EOF, if a readable or transform stream
// produces EOS as a chunk, the `pipe`s downstream are closed off.
export const EOS: Symbol = Symbol("End of Stream");

export type Chunk<A> = A | typeof EOS | typeof NONE;

export type PipeOpts<A> = {|
  init?: Chunk<A>,
  +readableStrategy?: QueuingStrategy,
  +writableStrategy?: QueuingStrategy,
  +trailing?: boolean,
|};

const PIPE_DEFAULTS: PipeOpts<any> = Object.freeze({
  init: NONE,
  readableStrategy: {},
  writableStrategy: {},
  trailing: false,
});

const PatchedArrow = PatchCrock(Arrow);

// Pipe class, it's a transform stream on steroids but more importantly
// it's also an arrow, which means that instances can be composed together
// using arrow operations and laws before connecting to any streams.
export class Pipe<A, B>
  extends classes(TransformStream, PatchedArrow)
  implements TransformStream<A, B>
{
  init: Chunk<A>;

  done: Promise<any>;

  fn: (?A, ?Controller<any>, ?boolean) => ?B;

  trailing: boolean;

  controller: Promise<Controller<any>>;

  /* Pipe :: <Controller c, Pair p>   Arrow (p c a) (p c b) */
  /* Pipe :: <Controller c>           TransformStream a b { (c, a) -> b } */

  /*
      Pair :: c -> a -> p c a
   */

  /*
     <Pair m>
      tFn :: p c a -> p c b
      = (p c a).extend(p c a -> b)
      = (p c a).extend((p c a).merge((c, a) -> b))
      = m => m.extend(m.merge(flip(fn)))
   */

  constructor(
    fn: (?A, ?Controller<any>, ?boolean) => ?B,
    pipeOpts: $Shape<PipeOpts<A>> = {}
  ) {
    const { init, readableStrategy, writableStrategy, trailing } = defaultProps(
      PIPE_DEFAULTS,
      pipeOpts
    );

    const adjustedInit: Chunk<A> = typeof init === "undefined" ? NONE : init;
    const [streamFinishPromise, resolveStreamFinish] = makePromise();
    const [selfP, resolveSelf] = makePromise();

    // Lift-ed input function that takes pairs and returns pairs
    // (A -> Controller -> B) ==> (Pair C A -> Pair C B)
    const transformFn: (Pair<Controller<any>, A>) => Pair<Controller<any>, B> =
      it.extend(it.merge((a, b) => fn(b, a)));

    // `Transformer.transform` implementation
    const transform = async (
      chunk: Chunk<A>,
      controller: Controller<any>
    ): void | Promise<any> => {
      // Short circuit on EOS
      if (chunk === EOS) {
        controller.terminate();
        return;
      }

      // Run transform function through underlying arrow
      // Pair Controller Chunk<A> -> Pair Controller Chunk<B>
      // $FlowFixMe
      const transformedPair: Pair<Controller<any>, ?B> = this.runWith(
        Pair(controller, chunk)
      );

      // Extract transformed value
      // Pair C B -> B
      const transformed: ?B = transformedPair.snd();

      // Enqueue result
      if (!isUndefined(transformed)) {
        controller.enqueue(transformed);
      }

      // If return value is a promise, make sure it is fulfilled before closing
      await Promise.resolve(transformed);
    };

    // start() is called when the stream is started
    const start = async (controller: Controller<any>) => (
      ((await selfP).controller = controller),
      adjustedInit !== NONE ? transform(adjustedInit, controller) : undefined
    );

    // flush() is called when stream is closing
    const flush = (controller: Controller<any>) => {
      if (trailing) {
        const isClosing = true;
        fn(undefined, controller, isClosing);
      }

      resolveStreamFinish();
    };

    // Prepare transformer
    const transformer: Transformer<Chunk<A>> = {
      start,
      transform,
      flush,
    };

    // Initialize arrow and transform stream
    // ([...argsForClassA], [...argsForClassB]) etc
    super(
      [transformer, readableStrategy, writableStrategy],
      [null, transformFn]
    );

    // Set properties
    this.init = adjustedInit;
    this.done = streamFinishPromise;
    this.fn = fn;
    this.trailing = !!trailing;

    resolveSelf(this);

    // Arrow compose behaves incorrectly with polytype
    // https://github.com/evilsoft/crocks/issues/406
    // FIXME: Remove the following monkey-patches once library gets a fix
    const arrowId = this.id.bind(this);

    this.constructor.id = () => {
      const { runWith } = arrowId();

      // eslint-disable-next-line no-use-before-define
      const idPipe = pipe(it);
      return Object.assign(idPipe, { runWith });
    };

    const arrowMap = this.map.bind(this);

    this.map = (f) => {
      const func = it.map(f);
      const { runWith } = arrowMap(func);

      // eslint-disable-next-line no-use-before-define
      const idPipe = pipe(it);
      return Object.assign(idPipe, { runWith });
    };

    const arrowContramap = this.contramap.bind(this);

    this.contramap = (f) => {
      const func = it.map(f);
      const mapped = arrowContramap(func);

      // eslint-disable-next-line no-use-before-define
      return pipe((x) => mapped.runWith(Pair(null, x)).snd());
    };

    this.promap = (f, g = it) => {
      const mapped = this.map(g);

      // eslint-disable-next-line no-use-before-define
      return pipe((x) => mapped.runWith(Pair(null, f(x))).snd());
    };

    this.compose = (pipe2) => {
      const func = (chunk, controller, isClosing) => {
        const inFn = this.fn;
        const outFn = pipe2.fn;

        if (isClosing) {
          pipe2.trailing && outFn(undefined, controller, true);
          this.trailing && inFn(undefined, controller, true);

          return;
        }

        const next = this.fn(chunk, controller);
        if (isUndefined(next)) {
          return;
        }

        return pipe2.fn(next, controller);
      };

      return pipe(func);
    };
  }
}

// Helper for creating instances of `Pipe` class
export default function pipe<A, B>(
  fn: (?A, ?Controller<any>, ?boolean) => B,
  pipeOpts: $Shape<PipeOpts<A>> = {}
): Pipe<A, B> {
  // Create instance of Pipe
  return new Pipe(fn, pipeOpts);
}

export { pipe };
