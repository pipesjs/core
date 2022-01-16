// @flow
// ./src/shared/utils/promiseFlag.js

import { _, it } from "param.macro";

export const promiseFlag = (flag: boolean): Promise<boolean> =>
  flag
    ? Promise.resolve(!!flag)
    : Promise.reject(
        new Error(`Falsey flag passed to promiseFlag: ${flag.toString()}`)
      );

export default promiseFlag;
