import { isFunction, isGeneratorFn } from "./utils";

import pipeAsync from "./pipeAsync";
import pipeFn from "./pipeFn";
import pipeGen from "./pipeGen";

/**
 * This function takes any normal/generator func and returns a transform stream.
 * @param {function} fn a function or a generator that returns transformed values
 * @param {object} opts containing config options
 * @returns TransformStream
 */
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

/**
 * This function takes any async func and returns a transform stream.
 * @name pipe.async
 * @param {function} asyncFunction an async function that returns a Promise
 * @param {object} opts containing config options
 * @returns TransformStream
 */
pipe.async = pipeAsync;

// Browserify compat
if ( typeof module !== "undefined" )
  module.exports = pipe;
