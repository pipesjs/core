try {
  require("babel-polyfill");
} catch (e) {
  console.error("babel-polyfill not loaded. " + e.toString() );
}

import accumulate from "./accumulate";
import connect from "./connect";
import chain from "./chain";
import flatten from "./flatten";
import merge from "./merge";
import pipe from "./pipe";
import split from "./split";

// Exports
export {
  accumulate,
  connect,
  chain,
  flatten,
  merge,
  pipe,
  split
};

// Default exports
const fns = {
  accumulate,
  connect,
  chain,
  flatten,
  merge,
  pipe,
  split
};

// Export to window
if ( typeof window !== "undefined")
  Object.assign( window, {
    Pipes: fns
  });

export default fns;
