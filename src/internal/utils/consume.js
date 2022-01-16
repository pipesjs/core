// @flow
// ./src/internal/utils/consume.js

import { _, it } from "param.macro";

export const consume = <A>(
  iterator: Iterator<A>,
  num: number = 0,
  _accumulator: Array<A> = []
) =>
  num === 0
    ? // No more values needed, return _accumulator
      _accumulator
    : (({ done, value }) =>
        done
          ? // Iterator finished, return _accumulator
            _accumulator
          : //
            // Otherwise, add value, then recurse and flatten result
            [value, ...consume(iterator, num - 1, _accumulator)])(
        //
        // Run iterator
        iterator.next()
      );

export default consume;
