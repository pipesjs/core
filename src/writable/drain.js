// @flow
// ./src/writable/drain.js

import { WritableStream } from "web-streams-polyfill";

function makeDrain(): WritableStream<any> {
  return new WritableStream({
    write: (chunk) => Promise.resolve(chunk),
  });
}

export default function drain(
  { recycle }: { recycle: boolean } = { recycle: false }
): { +writable: WritableStream<any> } {
  const w: WritableStream<any> = makeDrain();

  const wrapper = {
    get writable() {
      return recycle ? makeDrain() : w;
    },
  };

  return wrapper;
}

export { drain };
