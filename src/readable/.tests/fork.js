import { _, it } from "param.macro";


import { makeReadable, makeWritable } from "../../test_utils";
import { fork } from "../";

test("fork", async () => {
  const readable = makeReadable([1, 2, 3, 4]);

  const container1 = [];
  const container2 = [];

  const writable1 = makeWritable(container1);
  const writable2 = makeWritable(container2);

  const [readable1, readable2] = fork(readable, !(it % 2));

  await readable1.pipeTo(writable1);
  await readable2.pipeTo(writable2);

  expect(container1).toStrictEqual([2, 4]);
  expect(container2).toStrictEqual([1, 3]);
});
