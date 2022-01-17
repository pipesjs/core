// ./react/hooks/.tests/usePipe.js

import inspect from "inspect.macro";
import { _, it } from "param.macro";

import list from "@ygor/list";
import React, { useState } from "react";
import Renderer from "react-test-renderer";

import { pipe } from "../../../core";
import { makePromise } from "../../../internal/utils";
import { makeReadable, makeWritable } from "../../../test_utils";
import usePipe from "../usePipe";

process.on("unhandledRejection", (e) => inspect(e));

const ext = {
  container: [],
  write: null,
};

const p = pipe((a) => a + 1);
const Dada = (props) => {
  const [write, chunk, error] = usePipe(p);
  ext.write = write;

  if (chunk === undefined) return null;

  ext.container.push(chunk);
  return <p>{chunk}</p>;
};

const element = (
  <Dada>
    <p>bye</p>
  </Dada>
);

test("usePipe", async () => {
  const [done, finish] = makePromise();

  Renderer.act(() => {
    const node = Renderer.create(element);

    (function writeLoop() {
      if (!ext.write) return setTimeout(writeLoop, 0);
      [1, 2, 3].forEach(ext.write(_));
    })();

    (function readLoop() {
      if (!ext.container.length) return setTimeout(readLoop, 0);
      finish();
    })();
  });

  await list([p.readable, p.writable]).map(it.closed);
  await done;

  expect(ext.container).toStrictEqual([2, 3, 4]);
});
