// pipe :: Function | Generator Function -> Opts {} -> TransformBlueprint
// pipe takes any normal/generator func and returns transform stream blueprint.
//
// pipe.async :: Async Function -> Opts {} -> TransformBlueprint
// pipe.async takes any async func and returns transform stream blueprint.
//

import { isFunction, isGeneratorFn } from "./utils";

import pipeAsync from "./pipeAsync";
import pipeFn from "./pipeFn";
import pipeGen from "./pipeGen";

export default function pipe ( fn, opts ) {
  let blueprint;

  // Route to appropriate function
  if ( isGeneratorFn( fn ))
    blueprint = pipeGen( fn, opts );

  else if ( isFunction( fn ))
    blueprint = pipeFn( fn, opts );

  else
    throw new Error("Invalid argument");

  // Return Transform blueprint if not instance
  if ( this instanceof pipe )
    return new blueprint;

  else
    return blueprint;
}

// Add async support
pipe.async = pipeAsync;

// Browserify compat
if ( typeof module !== "undefined" )
  module.exports = pipe;

