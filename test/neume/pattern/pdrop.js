import assert from "assert";
import pdrop from "../../../src/neume/pattern/pdrop";
import pseq from "../../../src/neume/pattern/pseq";

describe("neume/pattern/pdrop(p, length)", () => {
  it("should create generator function that n items dropped", () => {
    const p1 = pseq([ 1, 2, 3 ], 3);
    const iter = pdrop(p1, 5)();

    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("default n is 1", () => {
    const p1 = pseq([ 1, 2, 3 ], 3);
    const iter = pdrop(p1)();

    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("chain method", () => {
    const p1 = pseq([ 1, 2, 3 ], 3);
    const iter = p1.drop(5)();

    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });
});
