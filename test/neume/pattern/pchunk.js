import assert from "assert";
import pchunk from "../../../src/neume/pattern/pchunk";
import pseq from "../../../src/neume/pattern/pseq";

describe("neume/pattern/pchunk(p, n)", () => {
  it("should create generator function that split into group n items", () => {
    const p1 = pseq([ 1, 2, 3 ], 3);
    const iter = pchunk(p1, 2)();

    assert.deepEqual(iter.next(), { value: [ 1, 2 ], done: false });
    assert.deepEqual(iter.next(), { value: [ 3, 1 ], done: false });
    assert.deepEqual(iter.next(), { value: [ 2, 3 ], done: false });
    assert.deepEqual(iter.next(), { value: [ 1, 2 ], done: false });
    assert.deepEqual(iter.next(), { value: [ 3    ], done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("default n is 1", () => {
    const p1 = pseq([ 1, 2, 3 ]);
    const iter = pchunk(p1)();

    assert.deepEqual(iter.next(), { value: [ 1 ], done: false });
    assert.deepEqual(iter.next(), { value: [ 2 ], done: false });
    assert.deepEqual(iter.next(), { value: [ 3 ], done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("accept pattern as n", () => {
    const p1 = pseq([ 1, 2, 3 ], Infinity);
    const p2 = pseq([ 2, 3 ]);
    const iter = pchunk(p1, p2)();

    assert.deepEqual(iter.next(), { value: [ 1, 2    ], done: false });
    assert.deepEqual(iter.next(), { value: [ 3, 1, 2 ], done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("chain method", () => {
    const p1 = pseq([ 1, 2, 3 ], 3);
    const iter = p1.chunk(2)();

    assert.deepEqual(iter.next(), { value: [ 1, 2 ], done: false });
    assert.deepEqual(iter.next(), { value: [ 3, 1 ], done: false });
    assert.deepEqual(iter.next(), { value: [ 2, 3 ], done: false });
    assert.deepEqual(iter.next(), { value: [ 1, 2 ], done: false });
    assert.deepEqual(iter.next(), { value: [ 3    ], done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });
});
