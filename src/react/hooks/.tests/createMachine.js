// ./src/react/hooks/.tests/createMachine.js

import inspect from "inspect.macro";
import { _, it } from "param.macro";

import { once } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Renderer from "react-test-renderer";
import { State } from "xstate";

import { makeReadable, makeWritable } from "../../../test_utils";
import { makePromise } from "../../../internal/utils";
import createMachine from "../createMachine";

const blueprint = {
  id: "gaga",
  initial: "active",
};

const { Provider, addState, useMachine, useService } = createMachine(blueprint);
const [resolvedState, _resolve] = makePromise();
const resolve = once(_resolve);

const Dad = (props) => {
  return <p>{props.children}</p>;
};

const Son = (props) => {
  addState({ inactive: { on: { TOGGLE: "active" } } });

  return <p>hello</p>;
};

const Daughter = ({ children }) => {
  addState({ active: { on: { TOGGLE: "inactive" } } });
  return <p>{children}</p>;
};

const GrandDaughter = ({ children }) => {
  const [current, send, service] = useService();

  if (!current) return null;
  resolve(current);

  return <p>{current + ""}</p>;
};

const element = (
  <Dad>
    <Son />
    <Daughter>
      <GrandDaughter />
    </Daughter>
  </Dad>
);

test("createMachine", async () => {
  const [done, finish] = makePromise();

  Renderer.act(() => {
    const node = Renderer.create(element);
    finish();
  });

  await done;
  const state = await resolvedState;

  expect(state instanceof State).toBe(true);
});
