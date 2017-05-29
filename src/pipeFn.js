// @flow

// pipeFn :: Function -> Opts {} -> TransformBlueprint
// pipeFn takes a function and wraps it into
// a transform streams.
// Returns a blueprint class that can be used to
// instantiate above streams.
//

import type {
  Transformer,
  TransformInterface,
  ReadableStrategy,
  WritableStrategy,
  ReadableStreamController,
  WritableStreamWriter
} from "./streams";

import type { anyFn } from "./utils";

import { TransformStream } from "./streams";
import { EOS } from "./utils";

export default function pipeFn ( fn: anyFn, {
    init, readableStrategy, writableStrategy
  }: {
  // opts
    init: ?mixed,
    readableStrategy: ?ReadableStrategy,
    writableStrategy: ?WritableStrategy
  }={} ): TransformInterface {

  // Prepare transformer
  let transformer: Transformer = {
    _unfulfilledFutures: [],
    // Run function and enqueue result
    transform ( chunk: mixed, controller: ReadableStreamController ) {
      let v: mixed = fn( chunk );

      // Check for EOS
      if ( v === EOS ) {
        controller.close();
        return;
      }

      if ( v !== void 0 )
        controller.enqueue( v );
    },

    // if passed
    readableStrategy,
    writableStrategy
  };

  // Wrap in blueprint class
  class TransformBlueprint extends TransformStream implements TransformInterface {
    constructor () {
      // Make stream
      let
        stream: TransformStream = super( transformer ),
        writer: WritableStreamWriter;

      // If init, push chunk
      if ( init !== void 0 ) {
        writer = stream.writable.getWriter();
        writer.write( init );

        // Release lock so other writers can start writing
        writer.releaseLock();
      }

      return stream;
    }
  }

  return TransformBlueprint;
}
