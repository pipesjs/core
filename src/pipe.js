import { isFunction, isGeneratorFn } from "./utils";

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
 *
 *   // Setup
 *   let createReadable = data => new ReadableStream({
 *       start (controller) {
 *       this.data = data || [1,2,3];
 *
 *       // Kickstart stream
 *       controller.enqueue( this.data.pop() );
 *       },
 *       pull (controller) {
 *       if ( !this.data.length )
 *           return controller.close()
 *
 *       controller.enqueue( this.data.pop() );
 *       }
 *   }),
 *   createWritable = () => new WritableStream({
 *       write (chunk) {
 *       console.log( chunk );
 *       }
 *   });
 *
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
 * @returns TransformStream
 */
pipe.async = pipeAsync;

// Browserify compat
if ( typeof module !== "undefined" )
  module.exports = pipe;
