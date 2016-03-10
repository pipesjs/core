import connect from "./connect";
import chain from "./chain";
import flatten from "./flatten";
import merge from "./merge";
import pipe from "./pipe";
import split from "./split";

// Exports
export {
  connect,
  chain,
  flatten,
  merge,
  pipe,
  split
};

// Default exports
const fns = {
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
