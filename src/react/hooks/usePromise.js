// ./src/react/hooks/usePromise.js

import { _, it } from "param.macro";

import { createUseFetch } from "fetch-suspense";
import { useMemo } from "react";

// Create fake fetch API to use useFetch hook as a promise handler
export const usePromise = (
  promise /* : Promise<T> | () => Promise<T> */,
  deps /*: ?Array<any> */
) =>
  (promise instanceof Promise
    ? [Promise.resolve(promise, _), []]
    : [promise, deps]) |>
  // Memoize resolved value
  useMemo(..._)
  |> createUseFetch(() => _) |>
  // Now use the hook to simulate usePromise that supports React.Suspense
  it("");
