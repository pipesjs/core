// @flow
// ./src/utils/filter.js

import { _, it } from "param.macro";

import Pred from "crocks/Pred";
import isSameType from "crocks/predicates/isSameType";

import type { PipeOpts } from "../core/pipe";

import {
  isFunction,
  isClass,
  isntFunction,
  not,
} from "../internal/utils/predicates";
import { Pipe } from "../core/pipe";

export type FilterPredicate<A> = Class<A> | A | ((?A) => boolean) | Pred<A>;

export class FilterPipe<A> extends Pipe<A, ?A> {
  constructor(check: (?A) => boolean, opts: $Shape<PipeOpts<A>>) {
    // $FlowFixMe
    const pipeFn: (?A) => ?A = (chunk) => (this.check(chunk) ? chunk : void 0);
    super(pipeFn, opts);

    this.check = check;
  }

  flip() {
    this.check = not(this.check);
    return this;
  }
}

export function toCheck<A>(predicate: FilterPredicate<A>): (A) => ?boolean {
  let check;

  switch (true) {
    case isSameType(Pred, predicate):
      // $FlowFixMe
      check = predicate.runWith(_);
      break;
    //
    case isClass(predicate):
      // $FlowFixMe
      check = _ instanceof predicate;
      break;
    //
    case isFunction(predicate):
      // $FlowFixMe
      check = predicate;
      break;
    //
    case isntFunction(predicate):
      // $FlowFixMe
      check = predicate === _;
      break;
    //
    default:
      throw new Error("Bad filter");
  }

  // $FlowFixMe
  return check;
}

export default function filter<A>(
  predicate: FilterPredicate<A>,
  opts: $Shape<PipeOpts<A>> = {}
): FilterPipe<A> {
  const check = toCheck(predicate);

  return new FilterPipe(
    // $FlowFixMe
    check,

    // $FlowFixMe
    opts
  );
}

export { filter };
