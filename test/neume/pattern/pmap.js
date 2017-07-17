import assert from "assert";
import pmap from "../../../src/neume/pattern/pmap";
import pseq from "../../../src/neume/pattern/pseq";

describe("neume/pattern/pmap(p, fn)", () => {
  it("should create generator function that map function", () => {
    const p1 = pseq([ 1, 2, 3 ], 2);
    const fn = x => x * 10;
    const iter = pmap(p1, fn)();

    assert.deepEqual(iter.next(), { value: 10, done: false });
    assert.deepEqual(iter.next(), { value: 20, done: false });
    assert.deepEqual(iter.next(), { value: 30, done: false });
    assert.deepEqual(iter.next(), { value: 10, done: false });
    assert.deepEqual(iter.next(), { value: 20, done: false });
    assert.deepEqual(iter.next(), { value: 30, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("yield* nested pattern", () => {
    const p1 = pseq([ 1, 2, 3 ], 2);
    const fn = x => pseq([ +x, -x ]);
    const iter = pmap(p1, fn)();

    assert.deepEqual(iter.next(), { value: +1, done: false });
    assert.deepEqual(iter.next(), { value: -1, done: false });
    assert.deepEqual(iter.next(), { value: +2, done: false });
    assert.deepEqual(iter.next(), { value: -2, done: false });
    assert.deepEqual(iter.next(), { value: +3, done: false });
    assert.deepEqual(iter.next(), { value: -3, done: false });
    assert.deepEqual(iter.next(), { value: +1, done: false });
    assert.deepEqual(iter.next(), { value: -1, done: false });
    assert.deepEqual(iter.next(), { value: +2, done: false });
    assert.deepEqual(iter.next(), { value: -2, done: false });
    assert.deepEqual(iter.next(), { value: +3, done: false });
    assert.deepEqual(iter.next(), { value: -3, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("chain method", () => {
    const p1 = pseq([ 1, 2, 3 ], 2);
    const fn = x => x * 10;
    const iter = p1.map(fn)();

    assert.deepEqual(iter.next(), { value: 10, done: false });
    assert.deepEqual(iter.next(), { value: 20, done: false });
    assert.deepEqual(iter.next(), { value: 30, done: false });
    assert.deepEqual(iter.next(), { value: 10, done: false });
    assert.deepEqual(iter.next(), { value: 20, done: false });
    assert.deepEqual(iter.next(), { value: 30, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });
});
