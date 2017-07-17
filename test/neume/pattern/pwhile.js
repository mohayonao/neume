import assert from "assert";
import pwhile from "../../../src/neume/pattern/pwhile";
import pseq from "../../../src/neume/pattern/pseq";

describe("neume/pattern/pwhile(p, cond)", () => {
  it("should create generator function that while cond", () => {
    const p1 = pseq([ 1, 2, 3 ], Infinity);
    const fn = x => x !== 3;
    const iter = pwhile(p1, fn)();

    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("accept pattern as cond", () => {
    const p1 = pseq([ 1, 2, 3 ], Infinity);
    const p2 = pseq([ 1, 1, 1, 1, 0 ]);
    const iter = pwhile(p1, p2)();

    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("chain method", () => {
    const p1 = pseq([ 1, 2, 3 ], Infinity);
    const fn = x => x !== 3;
    const iter = p1.while(fn)();

    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });
});
