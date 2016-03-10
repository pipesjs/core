# Contributing

Pull requests and issues welcome.

The library is written entirely in `ES6` and the source resides in the `src` folder. The tests are in the `test` folder, written in `ES6` and run by `mocha`s QUnit interface.

## Build instructions

 - `npm test` runs tests.
 - `npm run build` transpiles es6 files to es5.
 - `npm run dist` bundles the transpiled files into a browser package.
 - `npm run build-all` runs all of the above.

## Notes

 - Write tests for all feature additions and make sure they pass.
 - It's recommended to install the `pre-commit-hook` by running `ln -s ../../pre-commit-hook .git/hooks/pre-commit`. It runs tests and build before commiting.
 - Backwards compatibility must be maintained.
