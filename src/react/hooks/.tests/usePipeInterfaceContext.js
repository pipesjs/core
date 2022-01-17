// ./react/hooks/.tests/usePipeInterface.js

import { _, it } from "param.macro";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Renderer from "react-test-renderer";
import { TransformStream } from "web-streams-polyfill";

import { makeReadable, makeWritable } from "../../../test_utils";
import { pipe } from "../../../core";
import { makePromise } from "../../../internal/utils";
import usePipeInterfaceContext from "../usePipeInterfaceContext";

let source;
let _write;
const container = [];

const Dad = (props) => {
  const { readable, writable } = useMemo(
    () => new TransformStream({ transform: (c, ctrl) => ctrl.enqueue(c + 1) })
  );
  source = readable;

  const { Provider } = usePipeInterfaceContext;
  return (
    <Provider readable={readable} writable={writable}>
      {props.children}
    </Provider>
  );
};

const Son = (props) => {
  const { useWritable, useReadable } = usePipeInterfaceContext();
  const write = useWritable();
  const writeRef = useRef(write);

  _write = writeRef.current;

  const [chunk, error] = useReadable();

  if (chunk === undefined) return null;

  container.push(chunk);
  return <p>{chunk}</p>;
};

const element = (
  <Dad>
    <Son />
  </Dad>
);

test("usePipeInterfaceContext", async () => {
  const [done, finish] = makePromise();

  Renderer.act(() => {
    const node = Renderer.create(element);
    setTimeout(finish, 0);
  });

  _write(1);
  _write(2);
  _write(3);

  await source.closed;
  await done;

  expect(container).toStrictEqual([2, 3, 4]);
});
