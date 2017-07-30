import assert from "assert";
import pfunc from "../../../src/neume/pattern/pfunc";
import pseq from "../../../src/neume/pattern/pseq";

describe("neume/pattern/pfunc(fn, repeats)", () => {
  it("should create generator function that map function", () => {
    const fn = i => i * 10;
    const iter = pfunc(fn)();

    assert.deepEqual(iter.next(), { value:  0, done: false });
    assert.deepEqual(iter.next(), { value: 10, done: false });
    assert.deepEqual(iter.next(), { value: 20, done: false });
    assert.deepEqual(iter.next(), { value: 30, done: false });
  });

  it("should yield* nested pattern", () => {
    const fn = i => pseq([ i, 1 ]);
    const iter = pfunc(fn, 3)();

    assert.deepEqual(iter.next(), { value: 0, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });
});
