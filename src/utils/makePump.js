// ./src/utils/makePump.js

import { _, it } from "param.macro";

import ifElse from "crocks/logic/ifElse";
import tryCatch from "crocks/Result/tryCatch";

import { yc } from "../internal/utils";

const shutdown = (ctrl) => (ctrl.terminate || ctrl.close).call(ctrl, _);

export const makePump = (reader) =>
  ((recur) => async (controller) =>
    //
    // Read
    (await reader.read())
    |> ifElse(
      it.done,

      // Terminate if readable is done
      shutdown(controller),

      // Else, queue value
      ({ value }) =>
        value
        |> tryCatch(controller.enqueue(_)) |>
        //
        // Then, recurse
        // $FlowFixMe
        it.either(controller.error(_), recur(controller, _))
    )) |> yc;

export default makePump;
