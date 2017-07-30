import assert from "assert";
import Rand from "../../../src/scapi/units/Rand";

describe("scapi/units/Rand", () => {
  it(".new should create scalar rate node", () => {
    const node = Rand.new(10, 100);
    const type = node.type;

    assert(type.startsWith("Rand~"));
    assert.deepEqual(node, {
      type, rate: "scalar", props: [ 10, 100 ]
    });
  });

  it("default rate is scalar", () => {
    const node = Rand();
    const type = node.type;

    assert(type.startsWith("Rand~"));
    assert.deepEqual(node, {
      type, rate: "scalar", props: [ 0, 1 ]
    });
  });
});
