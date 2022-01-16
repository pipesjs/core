// @flow
// ./src/internal/structs/crocks.js

import _Arrow from "crocks/Arrow";

export class Arrow<T, U> extends _Arrow {
  constructor(fn: (T) => U) {
    return new _Arrow(fn);
  }
}

const all = {
  Arrow,
};

export default all;
