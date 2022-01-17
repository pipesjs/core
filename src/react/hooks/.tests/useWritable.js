// ./react/hooks/.tests/useWritable.js

import { _, it } from "param.macro";

import React, { useState } from "react";
import Renderer from "react-test-renderer";

import { makeWritable } from "../../../test_utils";
import { makePromise } from "../../../internal/utils";
import useWritable from "../useWritable";

const container = [];
const sink = makeWritable(container);

const Dada = (props) => {
  const write = useWritable(sink);
  if (!write) return null;

  write(1);
  write(2);
  write(3);

  return <p>hello</p>;
};

const element = (
  <Dada>
    <p>bye</p>
  </Dada>
);

test("useWritable", async () => {
  const [done, finish] = makePromise();

  Renderer.act(() => {
    const node = Renderer.create(element);
    finish();
  });

  await sink.closed;
  await done;

  expect(container).toStrictEqual([1, 2, 3]);
});
