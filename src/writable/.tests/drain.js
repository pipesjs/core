import { makeReadable } from "../../../../../test/utils";
import { drain } from "../";

test("drain", async () => {
  const a = makeReadable([1, 2]);
  const b = makeReadable([1, 2]);
  const c = makeReadable([1, 2]);

  const d = drain({ recycle: true });
  await Promise.all([
    a.pipeTo(d.writable),
    b.pipeTo(d.writable),
    c.pipeTo(d.writable),
  ]);
});
