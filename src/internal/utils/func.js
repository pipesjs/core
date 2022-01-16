// ./src/internal/utils/predicates.js

import { _, it } from "param.macro";

import { flatten } from "lodash";

export const compose =
  (f, g) =>
  (...args) =>
    g(...flatten([f(...args)]));
