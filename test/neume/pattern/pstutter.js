import assert from "assert";
import pstutter from "../../../src/neume/pattern/pstutter";
import pseq from "../../../src/neume/pattern/pseq";

describe("neume/pattern/pstutter(p, n)", () => {
  it("should create generator function that is stuttered", () => {
    const p1 = pseq([ 1, 2, 3 ]);
    const iter = pstutter(p1, 3)();

    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("default n is 2", () => {
    const p1 = pseq([ 1, 2, 3 ]);
    const iter = pstutter(p1)();

    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("accept pattern as n", () => {
    const p1 = pseq([ 1, 2, 3, 4 ]);
    const p2 = pseq([ 3, 2, 1 ]);
    const iter = pstutter(p1, p2)();

    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("chain method", () => {
    const p1 = pseq([ 1, 2, 3 ]);
    const iter = p1.stutter(3)();

    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });
});
