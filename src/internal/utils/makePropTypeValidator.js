// ./src/shared/utils/makePropTypeValidator.js

import { _, it } from "param.macro";

import tryCatch from "crocks/Result/tryCatch";
import { isUndefined, pick } from "lodash";
import PropTypes from "prop-types";

import invariant from "./invariant";
import { flip } from "./predicates";

// Make validate function
export const makePropTypeValidator = propTypes =>
  tryCatch(
    input => (
      // Make sure input is not undefined
      input |> isUndefined |> flip |> invariant(_, "input cannot be undefined"),
      //
      // Pick only prop types that match input
      pick(propTypes, Object.keys(input)) |>
        //
        // Validate input and throw on failure
        PropTypes.checkPropTypes(_, input)
        |> flip
        |> invariant(_, `input validation failed; expected: [${input}]`),
      //
      // If valid, return input
      input
    )
  );

export default makePropTypeValidator;
