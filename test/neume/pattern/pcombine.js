import assert from "assert";
import pcombine from "../../../src/neume/pattern/pcombine";
import pseq from "../../../src/neume/pattern/pseq";

describe("neume/pattern/pcombine(...args, fn)", () => {
  it("should create generator function that map function", () => {
    const p1 = pseq([ 1, 2, 3 ], 2);
    const p2 = pseq([ 10, 20 ], 3);
    const fn = (x, y) => ({ x, y });
    const iter = pcombine(p1, p2, fn)();

    assert.deepEqual(iter.next(), { value: { x: 1, y: 10 }, done: false });
    assert.deepEqual(iter.next(), { value: { x: 2, y: 20 }, done: false });
    assert.deepEqual(iter.next(), { value: { x: 3, y: 10 }, done: false });
    assert.deepEqual(iter.next(), { value: { x: 1, y: 20 }, done: false });
    assert.deepEqual(iter.next(), { value: { x: 2, y: 10 }, done: false });
    assert.deepEqual(iter.next(), { value: { x: 3, y: 20 }, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("yield* nested pattern", () => {
    const p1 = pseq([ 1, 2, 3 ], 2);
    const p2 = pseq([ 10, 20 ], 3);
    const fn = (x, y) => pseq([ y ], x);
    const iter = pcombine(p1, p2, fn)();

    assert.deepEqual(iter.next(), { value: 10, done: false });
    assert.deepEqual(iter.next(), { value: 20, done: false });
    assert.deepEqual(iter.next(), { value: 20, done: false });
    assert.deepEqual(iter.next(), { value: 10, done: false });
    assert.deepEqual(iter.next(), { value: 10, done: false });
    assert.deepEqual(iter.next(), { value: 10, done: false });
    assert.deepEqual(iter.next(), { value: 20, done: false });
    assert.deepEqual(iter.next(), { value: 10, done: false });
    assert.deepEqual(iter.next(), { value: 10, done: false });
    assert.deepEqual(iter.next(), { value: 20, done: false });
    assert.deepEqual(iter.next(), { value: 20, done: false });
    assert.deepEqual(iter.next(), { value: 20, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("chain method", () => {
    const p1 = pseq([ 1, 2, 3 ], 2);
    const p2 = pseq([ 10, 20 ], 3);
    const fn = (x, y) => ({ x, y });
    const iter = p1.combine(p2, fn)();

    assert.deepEqual(iter.next(), { value: { x: 1, y: 10 }, done: false });
    assert.deepEqual(iter.next(), { value: { x: 2, y: 20 }, done: false });
    assert.deepEqual(iter.next(), { value: { x: 3, y: 10 }, done: false });
    assert.deepEqual(iter.next(), { value: { x: 1, y: 20 }, done: false });
    assert.deepEqual(iter.next(), { value: { x: 2, y: 10 }, done: false });
    assert.deepEqual(iter.next(), { value: { x: 3, y: 20 }, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });
});
