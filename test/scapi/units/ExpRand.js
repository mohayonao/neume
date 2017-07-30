import assert from "assert";
import ExpRand from "../../../src/scapi/units/ExpRand";

describe("scapi/units/ExpRand", () => {
  it(".new should create scalar rate node", () => {
    const node = ExpRand.new(1, 2);
    const type = node.type;

    assert(type.startsWith("ExpRand~"));
    assert.deepEqual(node, {
      type, rate: "scalar", props: [ 1, 2 ]
    });
  });

  it("default rate is scalar", () => {
    const node = ExpRand();
    const type = node.type;

    assert(type.startsWith("ExpRand~"));
    assert.deepEqual(node, {
      type, rate: "scalar", props: [ 0.01, 1 ]
    });
  });
});
