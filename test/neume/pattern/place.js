import assert from "assert";
import place from "../../../src/neume/pattern/place";
import pseq from "../../../src/neume/pattern/pseq";

describe("neume/pattern/place(...args)", () => {
  it("should create generator function that is interlaced", () => {
    const p1 = pseq([ 1, 2, 3 ]);
    const p2 = pseq([ 0 ], Infinity);
    const iter = place(p1, p2)();

    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 0, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 0, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: 0, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("shoud convert to generator function if not", () => {
    const p1 = pseq([ 1, 2, 3 ]);
    const iter = place(p1, [ 0 ])();

    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: [ 0 ], done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: [ 0 ], done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: [ 0 ], done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("chain method", () => {
    const p1 = pseq([ 1, 2, 3 ]);
    const iter = p1.lace(0)();

    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 0, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 0, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: 0, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });
});
