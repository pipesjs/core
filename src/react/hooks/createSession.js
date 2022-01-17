// @flow
// ./src/react/hooks/createSession.js

import { _, it } from "param.macro";

import produce from "immer";
import { isFunction } from "lodash";
import { createContext, useContext } from "region-core";

import { invariant } from "../../internal/utils";

export const createSession = <T>(initial: T | Object = {}) => {
  const SessionContext = createContext(produce(initial, it));

  const update = (func: (T) => T | void) => (
    invariant(isFunction(func), "Only functions are accepted"),
    SessionContext.write(produce(_, func))
  );

  const useSession = [useContext(SessionContext), update, _];

  const { Consumer, Provider } = SessionContext;

  return {
    Consumer,
    Provider,
    update,
    useSession,
  };
};

export default createSession;
