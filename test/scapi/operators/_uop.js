import assert from "assert";
import _uop from "../../../src/scapi/operators/_uop";
import createNode from "../../../src/scapi/utils/createNode";

describe("scapi/operators/_uop(name, fn)", () => {
  it("should create unary operation function", () => {
    const fn = _uop("twice", a => a * 2);
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);

    assert(typeof fn === "function");
    assert(fn(2) === 4);
    assert(fn.call(2) === 4);
    assert(fn(null) === null);
    assert.deepEqual(fn(a), {
      type: "twice", rate: "audio", props: [ a ]
    });
  });
});
