// rollup.js
import co from "co";
import filesize from "rollup-plugin-filesize";
import { rollup } from "rollup";

import { genConfig, uglifier } from "./rollup.config";

co( function* rollupPackage () {

  let baseConfig = genConfig(),
      { dest, entry } = baseConfig,
      bundle, minifiedBundle;

  // Create a base bundle
  bundle = yield rollup( baseConfig );
  console.log("Generated base bundle");

  // Write to file
  yield bundle.write({ dest: baseConfig.dest });
  console.log("Wrote base bundle");

  // Create minified bundle
  let destParts = dest.split(".");
  destParts.pop(); destParts.push("min.js");

  dest = destParts.join(".");

  minifiedBundle = yield rollup({
    dest,
    entry,

    // Set cache to generated bundle for optimization
    cache: bundle,
    plugins: [
      uglifier,
      filesize()
    ]
  });
  console.log("Generated minified bundle");

  // Write to file
  yield minifiedBundle.write({ dest });
  console.log("Generated minified bundle");
});
