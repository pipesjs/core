import { EOS, isFunction, isGeneratorFn } from "./utils";

import pipeAsync from "./pipeAsync";
import pipeFn from "./pipeFn";
import pipeGen from "./pipeGen";

/**
 * This function takes any normal/generator func and returns a transform stream.
 * @param {function} fn a function or a generator that returns transformed values
 * @param {object} opts containing config options
 *
 * @returns {TransformStream}
 *
 * @example
 *   // Pure funtion example
 *   let negator = pipe( n => -n ),
 *     rIn = createReadable(),
 *     rOut;
 *
 *   rOut = rIn.pipeThrough( new negator );  // -1, -2, -3
 *
 *   // Basic generator example
 *   let doubler = pipe( function* (v) {
 *       yield v;
 *       yield v;
 *   }),
 *   rIn = createReadable(),
 *   rOut;
 *
 *   rOut = rIn.pipeThrough( new doubler );  // 1, 1, 2, 2, 3, 3
 *
 * @example
 *   // Infinite generator example
 *
 *   let inf = pipe( function* (v) {
 *       // Close on shutdown signal
 *       while( !( yield v ));
 *   }, {
 *       init: 1
 *   });
 *
 *   new inf;    // 1, 1, 1, 1...
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
 *
 * @returns TransformStream
 *
 * @example
 * // Basic async example
 * let serverTalker = pipe.async( async function (msg) {
 *     let response = await sendToServer( msg );
 *     return response;
 *   }),
 *   rIn = createReadable(),
 *   rOut;
 *
 * rOut = rIn.pipeThrough( new serverTalker );  // {response}, {response}, {response}
 *
 * @example
 * // Basic promise example
 * let serverTalker = pipe.async( function (msg) {
 *     let response = new Promise( resolve => {
 *       sendToServer( msg, resolve );
 *     });
 *     return response;
 *   }),
 *   rIn = createReadable(),
 *   rOut;
 *
 * rOut = rIn.pipeThrough( new serverTalker );  // {response}, {response}, {response}
 */
pipe.async = pipeAsync;

/**
 * "End of Stream" This is the equivalent of `EOF` char in UNIX systems, if a `pipe` `function` returns
 * this at any point, the streams are gracefully closed.
 *
 * @name pipe.eos
 * @example
 */
pipe.eos = EOS;

// Browserify compat
if ( typeof module !== "undefined" )
  module.exports = pipe;
