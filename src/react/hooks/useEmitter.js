// @flow
// ./src/react/hooks/usePromise.js

import { _, it } from "param.macro";

import useInstance from "@use-it/instance";
import { get, isFunction, forOwn, update } from "lodash";
import { useEffect } from "react";

export interface Emitter {
  on(string, Function): void;
  off(string, ?Function): void;
}

type CallbackCache = { [string]: Set<Function> };

export const useEmitter = (
  emitterInstance: Emitter,
  eventName: string,
  callback: Function
) => {
  const self = useInstance(
    ({
      emitter: null,
      cache: {}
    }: { emitter: ?Emitter, cache: CallbackCache })
  );

  useEffect(() => {
    self.emitter = isFunction(emitterInstance)
      ? emitterInstance()
      : emitterInstance;
    self.emitter = get(self.emitter, "current", self.emitter);

    const { emitter, cache } = self;

    update(cache, eventName, it || new Set());

    if (!emitter) return;
    if (cache[eventName].has(callback)) return;

    cache[eventName].add(callback);

    emitter.on(eventName, callback);

    // Return unsubscribe function
    // $FlowFixMe
    return forOwn(
      cache,
      (callbacks, name) => (
        [...callbacks].forEach(emitter.off(name, _)), delete cache[name]
      ),
      _
    );
  }, [emitterInstance, eventName, callback]);
};

export default useEmitter;
