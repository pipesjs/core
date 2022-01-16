// ./src/internal/utils/PatchCrock.js

import { functions, memoize } from "lodash";

export const PatchCrock = memoize((Crock) => {
  class Patched {
    constructor(ref, ...args) {
      this._ref = ref;

      if (!(ref instanceof Crock)) {
        this._ref = new Crock(...args);
      }
    }
  }

  const unit = Crock.id ? Crock.id() : Crock.empty();

  for (let method of functions(unit)) {
    if (method !== "constructor") {
      Patched.prototype[method] = function (...args) {
        let result = this._ref[method].apply(this._ref, args);

        if (result instanceof Crock) {
          result = new Patched(result);
        }

        return result;
      };
    }
  }

  return Patched;
});

export default PatchCrock;
