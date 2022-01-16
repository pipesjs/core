// ./src/internal/index.js
/* eslint-disable */

import * as structs from "./structs/*.js";
import * as utils from "./utils/*.js";
import exportAll from "export-all.macro";

exportAll("./*.js");

const internal = {
  structs,
  utils,
};

export default internal;
