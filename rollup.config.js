// rollup.config.js
import _async from "rollup-plugin-async";
import cleanup from "rollup-plugin-cleanup";
import commonjs from "rollup-plugin-commonjs";
import filesize from "rollup-plugin-filesize";
import flow from "rollup-plugin-flow";
import ignore from "rollup-plugin-ignore";
import resolve from "rollup-plugin-node-resolve";
import uglify from "rollup-plugin-uglify";

import { minify } from "uglify-es";

const prod = process.env.NODE_ENV === "production",
      entry = "src/index.js",
      moduleName = "Pipes.core";

export const uglifier = uglify({}, minify);
export let cache;

export function genConfig( prod=false ) {
  let dest = `dist/pipes.core.es6${ prod ? '.min' : '' }.js`;

  return Object.assign({}, {
    entry,
    moduleName,
    dest,
    cache,
    format: "iife",
    exports: "named",
    plugins: [
      flow(),
      commonjs({ include: 'node_modules/**' }),
      ignore(["babel-polyfill", "web-streams-polyfill"]),
      resolve(),
      _async(),
      cleanup(),
      prod && uglifier,
      filesize()
    ]
  } );
}

export default genConfig( prod );
