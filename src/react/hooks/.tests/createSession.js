// ./react/hooks/.tests/createSession.js

import { _, it } from "param.macro";

import React, { useEffect } from "react";
import Renderer from "react-test-renderer";

import { makePromise } from "../../../internal/utils";
import createSession from "../createSession";

let value;

const blueprint = {
  counter: 0,
};

const increment = ({ counter }) => ({ counter: counter + 1 });
const { Provider, update, useSession } = createSession(blueprint);

const Dad = (props) => {
  return <p>{props.children}</p>;
};

const Son = ({ children }) => {
  const [session, update] = useSession();
  useEffect(() => void update(increment), []);

  return <p>{children}</p>;
};

const Daughter = ({ children }) => {
  const [session, update] = useSession();
  useEffect(() => void update(increment), []);

  return <p>{children}</p>;
};

const GrandDaughter = ({ children }) => {
  const [session, update] = useSession();
  useEffect(() => void update(increment), []);

  value = session.counter;

  return <p>hello</p>;
};

const element = (
  <Dad>
    <Son />
    <Daughter>
      <GrandDaughter />
    </Daughter>
  </Dad>
);

test("createSession", async () => {
  const [done, finish] = makePromise();

  Renderer.act(() => {
    const node = Renderer.create(element);
    finish();
  });

  await done;

  expect(value).toBe(3);
});
