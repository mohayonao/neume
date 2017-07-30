import assert from "assert";
import psub from "../../../src/neume/pattern/psub";
import pseq from "../../../src/neume/pattern/pseq";

describe("neume/pattern/psub(p, fn, replacement)", () => {
  it("should create generator function that is filtered", () => {
    const p1 = pseq([ 1, 2, 3, 4, 5, 6, 7, 8 ]);
    const iter = psub(p1, x => x % 2)();

    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: 5, done: false });
    assert.deepEqual(iter.next(), { value: 7, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("accept pattern as n", () => {
    const p1 = pseq([ 1, 2, 3, 4, 5, 6, 7, 8 ]);
    const p2 = pseq([ 1, 1, 0, 1, 0 ]);
    const iter = psub(p1, p2, 0)();

    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 2, done: false });
    assert.deepEqual(iter.next(), { value: 0, done: false });
    assert.deepEqual(iter.next(), { value: 4, done: false });
    assert.deepEqual(iter.next(), { value: 0, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("chain method", () => {
    const p1 = pseq([ 1, 2, 3, 4, 5, 6, 7, 8 ]);
    const iter = p1.sub(x => x % 2, 0)();

    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 0, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: 0, done: false });
    assert.deepEqual(iter.next(), { value: 5, done: false });
    assert.deepEqual(iter.next(), { value: 0, done: false });
    assert.deepEqual(iter.next(), { value: 7, done: false });
    assert.deepEqual(iter.next(), { value: 0, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });
});
