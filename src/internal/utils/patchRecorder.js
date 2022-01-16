// ./src/shared/utils/patchRecorder.js

import global from "global";
import window from "global/window";

export const patchRecorder = () => {
  if (window.MediaRecorder) return window.MediaRecorder;

  // FIXME: Shitty patch
  global.window = window;
  global.navigator = global;
  return (global.MediaRecorder = require("audio-recorder-polyfill"));
};

export default patchRecorder;
