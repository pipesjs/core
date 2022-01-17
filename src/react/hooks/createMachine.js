// @flow
// ./src/react/hooks/createMachine.js

import { useAutoEffect } from "hooks.macro";
import { _, it } from "param.macro";

import type { State } from "xstate";

import { merge } from "lodash";
import { update } from "qim";
import React, { useRef, useState } from "react";
import { createContext, useContext } from "region-core";
import { interpret, Machine } from "xstate";

export const createMachine = (machineDef: Object = {}) => {
  const MachineContext = createContext({ machine: null, stateDefs: [] });
  const ServiceContext = createContext(null);

  const addState = (stateDef: State) =>
    MachineContext.write(
      update(["stateDefs", (defs) => defs.push(stateDef)], _)
    );

  const getStates = () => merge(...useContext(MachineContext).stateDefs);

  const writeMachine = (states) =>
    MachineContext.write(
      merge(_, {
        machine: Machine({ ...machineDef, states }),
      })
    );

  const useMachine = () => {
    const { machine } = useContext(MachineContext);
    const states = getStates();

    if (!machine) {
      return writeMachine(states).machine;
    }

    return machine;
  };

  const useService = () => {
    const machine = useMachine();
    const [currentState, setCurrentState] = useState();
    const service = useContext(ServiceContext);
    const listenerRef = useRef();

    useAutoEffect(
      () => () =>
        service && listenerRef.current && service.off(listenerRef.current)
    );

    if (!machine) return [];

    if (!service) {
      ServiceContext.write(interpret(machine));
      return [];
    }

    if (!listenerRef.current) {
      listenerRef.current = service.subscribe(setCurrentState);
      setCurrentState(service.initialState);
    }

    return [currentState, service.send(_), service];
  };

  const Provider = ({ children, blueprint, ...args }: Object = {}) => (
    <MachineContext.Provider value={blueprint} {...args}>
      {children || []}
    </MachineContext.Provider>
  );

  const Consumer = ({ children, ...args }: Object = {}) => (
    <ServiceContext.Consumer {...args}>
      {children || []}
    </ServiceContext.Consumer>
  );

  return {
    Consumer,
    Provider,
    addState,
    useMachine,
    useService,
  };
};

export default createMachine;
