import assert from "assert";
import sinon from "sinon";
import multiMap from "../../../src/scapi/utils/multiMap";

describe("scapi/utils/multiMap(list, fn)", () => {
  it("should call fn with arguments given list", () => {
    const a = [ 10, 20 ];
    const fn = sinon.spy((...args) => args);

    const b = multiMap(a, fn);

    assert.deepEqual(b, [ 10, 20 ]);
    assert(fn.callCount === 1);
    assert.deepEqual(fn.args[0], [ 10, 20 ]);
  });

  it("should call fn with arguments given list flatten", () => {
    const a = [ 10, [ 20, 30 ] ];
    const fn = sinon.spy((...args) => args);

    const b = multiMap(a, fn);

    assert.deepEqual(b, [ [ 10, 20 ], [ 10, 30 ] ]);
    assert(fn.callCount === 2);
    assert.deepEqual(fn.args[0], [ 10, 20 ]);
    assert.deepEqual(fn.args[1], [ 10, 30 ]);
  });

  it("should call fn with arguments given list deep flatten", () => {
    const a = [ 10, [ 20, [ 30, 40 ] ] ];
    const fn = sinon.spy((...args) => args);

    const b = multiMap(a, fn);

    assert.deepEqual(b, [ [ 10, 20 ], [ [ 10, 30 ], [ 10, 40 ] ] ]);
    assert(fn.callCount === 3);
    assert.deepEqual(fn.args[0], [ 10, 20 ]);
    assert.deepEqual(fn.args[1], [ 10, 30 ]);
    assert.deepEqual(fn.args[2], [ 10, 40 ]);
  });
});
