import assert from "assert";
import pzip from "../../../src/neume/pattern/pzip";
import pseq from "../../../src/neume/pattern/pseq";

describe("neume/pattern/pzip(...args)", () => {
  it("should create generator function that is zipped", () => {
    const p1 = pseq([ 1, 2, 3 ]);
    const p2 = pseq([ 0 ], Infinity);
    const iter = pzip(p1, p2)();

    assert.deepEqual(iter.next(), { value: [ 1, 0 ], done: false });
    assert.deepEqual(iter.next(), { value: [ 2, 0 ], done: false });
    assert.deepEqual(iter.next(), { value: [ 3, 0 ], done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("shoud convert to generator function if not", () => {
    const p1 = pseq([ 1, 2, 3 ]);
    const iter = pzip(p1, [ 0 ])();

    assert.deepEqual(iter.next(), { value: [ 1, [ 0 ] ], done: false });
    assert.deepEqual(iter.next(), { value: [ 2, [ 0 ] ], done: false });
    assert.deepEqual(iter.next(), { value: [ 3, [ 0 ] ], done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("chain method", () => {
    const p1 = pseq([ 1, 2, 3 ]);
    const p2 = pseq([ 0 ], Infinity);
    const iter = p1.zip(p2)();

    assert.deepEqual(iter.next(), { value: [ 1, 0 ], done: false });
    assert.deepEqual(iter.next(), { value: [ 2, 0 ], done: false });
    assert.deepEqual(iter.next(), { value: [ 3, 0 ], done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });
});
