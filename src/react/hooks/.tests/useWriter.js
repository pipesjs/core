// ./react/hooks/.tests/useWriter.js

import { _, it } from "param.macro";

import React, { useState } from "react";
import Renderer from "react-test-renderer";

import { makeWritable } from "../../../test_utils";
import { makePromise } from "../../../internal/utils";
import useWriter from "../useWriter";

const container = [];
const sink = makeWritable(container);

const Dada = (props) => {
  const [writer, releaseWriter] = useWriter(sink);

  writer.write(1);
  releaseWriter();

  return <p>hello</p>;
};

const element = (
  <Dada>
    <p>bye</p>
  </Dada>
);

test("useWriter", async () => {
  const [done, finish] = makePromise();

  Renderer.act(() => {
    const node = Renderer.create(element);
    finish();
  });

  await sink.closed;
  await done;

  expect(container).toStrictEqual([1]);
});
