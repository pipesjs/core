// @flow
// ./src/react/hooks/usePipeInterfaceContext.js

import type { TransformStream } from "web-streams-polyfill";
import createUseContext from "constate";

import type { PipeInterface } from "./usePipeInterface";

import { usePipeInterface } from ".";

export const usePipeInterfaceContext: <A, B>(
  TransformStream<A, B>,
  Object
) => PipeInterface<A, B> = createUseContext(usePipeInterface);

export default usePipeInterfaceContext;
