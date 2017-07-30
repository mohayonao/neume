import assert from "assert";
import pscan from "../../../src/neume/pattern/pscan";
import pseq from "../../../src/neume/pattern/pseq";
import pmap from "../../../src/neume/pattern/pmap";

describe("neume/pattern/pscan(p, fn, initValue)", () => {
  it("should create generator function that is scanned", () => {
    const p1 = pseq([ 1, 2, 3 ]);
    const fn = (a, b) => a + b;
    const iter = pscan(p1, fn)();

    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: 6, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("accept pattern as n", () => {
    const p1 = pseq([ 1, 2, 3 ]);
    const fn = (a, b) => pmap(a, x => x * b);
    const iter = pscan(p1, fn, pseq([ 10, 20 ]))();

    assert.deepEqual(iter.next(), { value:  10, done: false });
    assert.deepEqual(iter.next(), { value:  20, done: false });
    assert.deepEqual(iter.next(), { value:  20, done: false });
    assert.deepEqual(iter.next(), { value:  40, done: false });
    assert.deepEqual(iter.next(), { value:  60, done: false });
    assert.deepEqual(iter.next(), { value: 120, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("chain method", () => {
    const p1 = pseq([ 1, 2, 3 ]);
    const fn = (a, b) => a + b;
    const iter = p1.scan(fn)();

    assert.deepEqual(iter.next(), { value: 1, done: false });
    assert.deepEqual(iter.next(), { value: 3, done: false });
    assert.deepEqual(iter.next(), { value: 6, done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });
});
