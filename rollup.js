// rollup.js
import co from "co";
import filesize from "rollup-plugin-filesize";
import { rollup } from "rollup";

import { default as baseConfig, genConfig, uglifier } from "./rollup.config";

co( function* rollupPackage () {

  let bundle, minifiedBundle;

  // Create a base bundle
  bundle = yield rollup( baseConfig );
  console.log("Generated base bundle");

  // Write to file
  yield bundle.write( baseConfig );
  console.log(`Wrote base bundle to ${ baseConfig.dest }`);

  // Create minified bundle
  let prodConfig = genConfig( true );

  minifiedBundle = yield rollup( Object.assign( prodConfig, {
    // Set cache to generated bundle for optimization
    cache: bundle,
    plugins: [
      uglifier,
      filesize()
    ]
  }) );
  console.log("Generated minified bundle");

  // Write to file
  yield minifiedBundle.write( prodConfig );
  console.log(`Wrote minified bundle to ${ prodConfig.dest }`);
});
