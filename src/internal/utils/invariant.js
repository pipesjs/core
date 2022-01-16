// @flow
// ./src/internal/utils/invariant.js

export class InvariantError extends Error {}

export default function invariant<A>(value: A, message: string = ""): ?A {
  if (!value) {
    // $FlowFixMe
    throw new InvariantError(message || `Value: <${value}> not truthy`);
  }

  return value;
}

export { invariant };
