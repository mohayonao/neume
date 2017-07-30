import assert from "assert";
import ptake from "../../../src/neume/pattern/ptake";
import pseq from "../../../src/neume/pattern/pseq";

describe("neume/pattern/ptake(p, length)", () => {
  it("should create generator function that n items taken", () => {
    const p1 = pseq([ 1, 2, 3 ], Infinity);
    const iter = ptake(p1, 5)();

    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("default n is 1", () => {
    const p1 = pseq([ 1, 2, 3 ]);
    const iter = ptake(p1)();

    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("chain method", () => {
    const p1 = pseq([ 1, 2, 3 ], Infinity);
    const iter = p1.take(5)();

    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });
});
