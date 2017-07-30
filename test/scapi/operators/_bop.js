import assert from "assert";
import _bop from "../../../src/scapi/operators/_bop";
import createNode from "../../../src/scapi/utils/createNode";

describe("scapi/operators/_bop(name, fn)", () => {
  it("should create binary operation function", () => {
    const fn = _bop("add", (a, b) => a + b);
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = createNode("SinOsc", "audio", [ 440, 0 ]);

    assert(typeof fn === "function");
    assert(fn(1, 2) === 3);
    assert(fn.call(1, 2) === 3);
    assert(fn(1, null) === null);
    assert(fn(null, 2) === null);
    assert.deepEqual(fn(a, b), {
      type: "add", rate: "audio", props: [ a, b ]
    });
  });
});
