import assert from "assert";
import BufChannels from "../../../src/scapi/units/BufChannels";

describe("scapi/units/BufChannels", () => {
  it(".kr should create control rate node", () => {
    const node = BufChannels.kr(1);

    assert.deepEqual(node, {
      type: "BufChannels", rate: "control", props: [ 1 ]
    });
  });

  it(".ir should create scalar rate node", () => {
    const node = BufChannels.ir(1);

    assert.deepEqual(node, {
      type: "BufChannels", rate: "scalar", props: [ 1 ]
    });
  });

  it("default rate is control", () => {
    const node = BufChannels();

    assert.deepEqual(node, {
      type: "BufChannels", rate: "control", props: [ 0 ]
    });
  });
});
