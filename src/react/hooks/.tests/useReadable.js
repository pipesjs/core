// ./src/react/hooks/.tests/useReadable.js

import { _, it } from "param.macro";

import React, { useState } from "react";
import Renderer from "react-test-renderer";

import { makeReadable, makeWritable } from "../../../test_utils";
import { makePromise } from "../../../internal/utils";
import useReadable from "../useReadable";

const source = makeReadable([1, 2, 3, 4, 5]);
const container = [];

const Dada = (props) => {
  const [chunk, error] = useReadable(source);

  if (chunk === undefined) return null;

  container.push(chunk);
  return <p>{chunk}</p>;
};

const element = (
  <Dada>
    <p>bye</p>
  </Dada>
);

test("useReadable", async () => {
  const [done, finish] = makePromise();

  Renderer.act(() => {
    const node = Renderer.create(element);
    setTimeout(finish, 0);
  });

  await source.closed;
  await done;

  expect(container).toStrictEqual([1, 2, 3, 4, 5]);
});
