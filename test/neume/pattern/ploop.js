import assert from "assert";
import ploop from "../../../src/neume/pattern/ploop";
import pseq from "../../../src/neume/pattern/pseq";

describe("neume/pattern/ploop(p)", () => {
  it("should create generator function that infinite repeats", () => {
    const p1 = pseq([ 1, 2, 3 ]);
    const iter = ploop(p1)();

    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
  });

  it("chain method", () => {
    const p1 = pseq([ 1, 2, 3 ]);
    const iter = p1.loop()();

    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
  });
});
