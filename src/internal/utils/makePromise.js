// @flow

// ./src/internal/utils/makePromise.js

import Promise from "pacta";

export default function makePromise(): Array<Promise | Function> {
  let reject;
  let resolve;
  const promise = new Promise((_resolve, _reject) => {
    reject = _reject;
    resolve = _resolve;
  });

  return [promise, resolve, reject];
}

export { makePromise };
