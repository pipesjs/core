// ./react/hooks/.tests/useTap.js

import { _, it } from "param.macro";

import React, { useState } from "react";
import Renderer from "react-test-renderer";

import { makeReadable, makeWritable } from "../../../test_utils";
import { makePromise } from "../../../internal/utils";
import useTap from "../useTap";

let remainder;
const source = makeReadable([1, 2, 3, 4, 5]);
const container1 = [];
const container2 = [];
const sink = makeWritable(container2);
const [ready, setReady] = makePromise();

const Dada = (props) => {
  const [chunk, error, rest] = useTap(source, !(it % 2));
  remainder = remainder ? remainder : rest;
  remainder && setReady();

  if (chunk === undefined) return null;

  container1.push(chunk);
  return <p>{chunk}</p>;
};

const element = (
  <Dada>
    <p>bye</p>
  </Dada>
);

test("useTap", async () => {
  const [done, finish] = makePromise();

  Renderer.act(() => {
    const node = Renderer.create(element);
    finish();
  });

  await done;
  await ready;
  await remainder.pipeTo(sink);
  await source.closed;

  expect(container1).toStrictEqual([2, 4]);
  expect(container2).toStrictEqual([1, 3, 5]);
});
