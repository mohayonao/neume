import assert from "assert";
import IRand from "../../../src/scapi/units/IRand";

describe("scapi/units/IRand", () => {
  it(".new should create scalar rate node", () => {
    const node = IRand.new(10, 100);
    const type = node.type;

    assert(type.startsWith("IRand~"));
    assert.deepEqual(node, {
      type, rate: "scalar", props: [ 10, 100 ]
    });
  });

  it("default rate is scalar", () => {
    const node = IRand();
    const type = node.type;

    assert(type.startsWith("IRand~"));
    assert.deepEqual(node, {
      type, rate: "scalar", props: [ 0, 127 ]
    });
  });
});
