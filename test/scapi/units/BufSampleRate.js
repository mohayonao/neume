import assert from "assert";
import BufSampleRate from "../../../src/scapi/units/BufSampleRate";

describe("scapi/units/BufSampleRate", () => {
  it(".kr should create control rate node", () => {
    const node = BufSampleRate.kr(1);

    assert.deepEqual(node, {
      type: "BufSampleRate", rate: "control", props: [ 1 ]
    });
  });

  it(".ir should create scalar rate node", () => {
    const node = BufSampleRate.ir(1);

    assert.deepEqual(node, {
      type: "BufSampleRate", rate: "scalar", props: [ 1 ]
    });
  });

  it("default rate is control", () => {
    const node = BufSampleRate();

    assert.deepEqual(node, {
      type: "BufSampleRate", rate: "control", props: [ 0 ]
    });
  });
});
