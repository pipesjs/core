// ./react/hooks/.tests/useReader.js

import { _, it } from "param.macro";

import React, { useState } from "react";
import Renderer from "react-test-renderer";

import { makeReadable, makeWritable } from "../../../test_utils";
import { makePromise } from "../../../internal/utils";
import useReader from "../useReader";

const source = makeReadable([1, 2, 3, 4, 5]);
const container = [];

const Dada = (props) => {
  const [reader, releaseReader] = useReader(source);

  reader.read().then(container.push(_.value));
  releaseReader();

  return <p>hello</p>;
};

const element = (
  <Dada>
    <p>bye</p>
  </Dada>
);

test("useReader", async () => {
  const [done, finish] = makePromise();

  Renderer.act(() => {
    const node = Renderer.create(element);
    finish();
  });

  await source.closed;
  await done;

  expect(container).toStrictEqual([1]);
});
