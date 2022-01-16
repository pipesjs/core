// @flow
// ./src/shared/utils/promiseEvent.js

import { _, it } from "param.macro";

import makePromise from "./makePromise";

export interface EventStore<T> {
  on?: (string, (T) => void) => void;
  addEventListener?: (string, (T) => void) => void;
  off?: (string, ?(T) => void) => void;
  removeEventListener?: (string, ?(T) => void) => void;
}

export const promiseEvent = <T>(
  eventStore: EventStore<T>,
  eventName: string
): Promise<T> => {
  const [promise, fulfill] = makePromise();

  const listen: Function = eventStore[
    // $FlowFixMe
    "on" in eventStore ? "on" : "addEventListener"
  ](eventName, _);

  const unlisten: Function = eventStore[
    // $FlowFixMe
    "off" in eventStore ? "off" : "removeEventListener"
  ](eventName, _);

  const handle: Function = (t: T) => (fulfill(t), unlisten(handle));

  listen(handle);
  return promise;
};

export default promiseEvent;
