import assert from "assert";
import pconcat from "../../../src/neume/pattern/pconcat";
import pseq from "../../../src/neume/pattern/pseq";

describe("neume/patten/pconcat(...args)", () => {
  it("should create generator function that concatnate generator functions", () => {
    const p1 = pseq([ 1, 2 ], 3);
    const p2 = pseq([ 10, 20 ], 1);
    const iter = pconcat(p1, p2)();

    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 10, done: false });
    assert.deepEqual(iter.next(), { value: 20, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("yield* nested pattern", () => {
    const p1 = pseq([ 1, 2 ], 3);
    const p2 = pseq([ 10, p1 ], 1);
    const iter = pconcat(p1, p2)();

    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 10, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("chain method", () => {
    const p1 = pseq([ 1, 2 ], 3);
    const p2 = pseq([ 10, 20 ], 1);
    const iter = p1.concat(p2)();

    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 10, done: false });
    assert.deepEqual(iter.next(), { value: 20, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });
});
