// ./src/utils/passthrough.js

import { _, it } from "param.macro";

import pipe from "../core/pipe";

export const passthrough = pipe(it, _);
export default passthrough;
