Installing
----------

### For browsers

The library depends on a [polyfill](https://github.com/creatorrr/web-stream-polyfill) for browsers that don't support `Stream` APIs yet (which as of now, is all of them), so make sure you include it in before including the library.

You can use either of the builds from the `dist` folder:

```html
    <script src="path/to/web-streams-polyfill.js"></script>
    <script src="path/to/pipes.core.js"></script>
```

And in your code, all the functions will be available on the `window.Pipes` variable.

```javascript

    let { pipe, flatten } = window.Pipes;

    flatten(/* some streams here */);
```

### For browserify users

The library has a [peer-dependency](https://nodejs.org/en/blog/npm/peer-dependencies/) on [web-streams-polyfill](https://github.com/creatorrr/web-stream-polyfill), so to install it:

```bash

    npm install web-streams-polyfill @pipes/core

```

The library is split up into modules, so you can both require the whole library or only parts of it:

```javascript

    let { flatten } = require("@pipes/core");
    let merge = require("@pipes/core/merge");
```

### For ES6 and Rollup users

If you want, you can directly import the es6 modules like so:

```javascript

    import pipes from "@pipes/core/src";
    import { flatten } from "@pipes/core/src";
    import flatten from "@pipes/core/src/flatten";
```
