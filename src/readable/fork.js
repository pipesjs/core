// ./src/readable/fork.js

import { _, it } from "param.macro";

import { tee } from "../core";
import { consume } from "../internal/utils";
import { filter } from "../utils";

// FIXME: Types commented out since flow doesn't support pipe operator yet.
export const fork /* : <A>(
  ReadableStream<A>,
  FilterPredicate<A>
) => [ReadableStream<A>, ReadableStream<A>] */ = (readable, predicate) =>
  tee(readable)
  |> consume(_, 2)
  |> [
    it[0].pipeThrough(filter(predicate)),
    it[1].pipeThrough(filter(predicate).flip()),
  ];

export default fork;
