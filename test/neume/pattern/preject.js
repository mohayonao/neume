import assert from "assert";
import preject from "../../../src/neume/pattern/preject";
import pseq from "../../../src/neume/pattern/pseq";

describe("neume/pattern/preject(p, fn)", () => {
  it("should create generator function that is filtered", () => {
    const p1 = pseq([ 1, 2, 3, 4, 5, 6, 7, 8 ]);
    const iter = preject(p1, x => x % 2)();

    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 4, done: false });
    assert.deepEqual(iter.next(), { value: 6, done: false });
    assert.deepEqual(iter.next(), { value: 8, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("accept pattern as n", () => {
    const p1 = pseq([ 1, 2, 3, 4, 5, 6, 7, 8 ]);
    const p2 = pseq([ 1, 1, 0, 1, 0 ]);
    const iter = preject(p1, p2)();

    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: 5, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("chain method", () => {
    const p1 = pseq([ 1, 2, 3, 4, 5, 6, 7, 8 ]);
    const iter = p1.reject(x => x % 2)();

    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 4, done: false });
    assert.deepEqual(iter.next(), { value: 6, done: false });
    assert.deepEqual(iter.next(), { value: 8, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });
});
