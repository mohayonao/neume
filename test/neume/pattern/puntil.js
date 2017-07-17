import assert from "assert";
import puntil from "../../../src/neume/pattern/puntil";
import pseq from "../../../src/neume/pattern/pseq";

describe("neume/pattern/puntil(p, cond)", () => {
  it("should create generator function that while cond", () => {
    const p1 = pseq([ 1, 2, 3 ], Infinity);
    const fn = x => x === 3;
    const iter = puntil(p1, fn)();

    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("accept pattern as cond", () => {
    const p1 = pseq([ 1, 2, 3 ], Infinity);
    const p2 = pseq([ 0, 0, 0, 0, 1 ]);
    const iter = puntil(p1, p2)();

    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("chain method", () => {
    const p1 = pseq([ 1, 2, 3 ], Infinity);
    const fn = x => x === 3;
    const iter = p1.until(fn)();

    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });
});
