// ./src/internal/utils/predicates.js

import { _, it } from "param.macro";

import implies from "crocks/logic/implies";

import {
  ReadableStream,
  WritableStream,
  TransformStream,
} from "web-streams-polyfill";

import { Pipe } from "../pipes/core/pipe";

export const and = (f, g) => (a) => f(a) && g(a);
export const or = (f, g) => (a) => f(a) || g(a);
export const not = (f) => (a) => !f(a);
export const flip = it ^ true;
export const isReadable = it instanceof ReadableStream;
export const isWritable = it instanceof WritableStream;
export const isTransformInstance = it instanceof TransformStream;
export const isPipe = it instanceof Pipe;

export const isReadableWritable = and(
  isReadable(_.readable),
  isWritable(_.writable)
);

export const isTransform = or(isTransformInstance, isReadableWritable);

export const isFunction = (f) => typeof f === "function";
export const throwsWithoutNew = (C) => {
  try {
    C();
    return false;
  } catch (e) {
    return e instanceof TypeError ? true : false;
  }
};

export const isClass = implies(isFunction, throwsWithoutNew);
export const isntFunction = not(isFunction);
