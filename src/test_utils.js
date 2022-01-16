import { _, it } from "param.macro";
import { ReadableStream, WritableStream } from "web-streams-polyfill";

export const throwIfNotTrue = t => {
  if (!t) throw new Error();
};

export const makeEagerReadable = arr => {
  return new ReadableStream({
    start(controller) {
      arr.map(controller.enqueue(_));
      controller.close();

      return Promise.resolve(null);
    }
  });
};

export const makeReadable = origArr => {
  let current;
  const arr = [...origArr];

  const end = {};
  arr.push(end);

  return new ReadableStream({
    pull(controller) {
      const c = arr.shift();
      current = c;
      return current === end ? controller.close() : controller.enqueue(c);
    }
  });
};

export const makeWritable = arr =>
  new WritableStream({
    write(chunk) {
      arr.push(chunk);
    }
  });

export const consume = async (reader, result = []) => {
  let finished = false;

  while (!finished) {
    const { done, value } = await reader.read();
    if ((finished = done)) {
      break;
    }
    result.push(value);
  }

  return result;
};
