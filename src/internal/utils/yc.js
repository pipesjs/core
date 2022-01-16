// @flow
// ./src/internal/utils/yc.js

import { _ } from "param.macro";

const ap = (f) => f(f);
export const yc = ap((f) => _(ap(f)(_)));

export default yc;
