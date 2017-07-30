import assert from "assert";
import BufDur from "../../../src/scapi/units/BufDur";

describe("scapi/units/BufDur", () => {
  it(".kr should create control rate node", () => {
    const node = BufDur.kr(1);

    assert.deepEqual(node, {
      type: "BufDur", rate: "control", props: [ 1 ]
    });
  });

  it(".ir should create scalar rate node", () => {
    const node = BufDur.ir(1);

    assert.deepEqual(node, {
      type: "BufDur", rate: "scalar", props: [ 1 ]
    });
  });

  it("default rate is control", () => {
    const node = BufDur();

    assert.deepEqual(node, {
      type: "BufDur", rate: "control", props: [ 0 ]
    });
  });
});
