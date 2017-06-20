import assert from "assert";
import BufSamples from "../../../src/scapi/units/BufSamples";

describe("scapi/units/BufSamples", () => {
  it(".kr should create control rate node", () => {
    const node = BufSamples.kr(1);

    assert.deepEqual(node, {
      type: "BufSamples", rate: "control", props: [ 1 ]
    });
  });

  it(".ir should create scalar rate node", () => {
    const node = BufSamples.ir(1);

    assert.deepEqual(node, {
      type: "BufSamples", rate: "scalar", props: [ 1 ]
    });
  });

  it("default rate is control", () => {
    const node = BufSamples();

    assert.deepEqual(node, {
      type: "BufSamples", rate: "control", props: [ 0 ]
    });
  });
});
