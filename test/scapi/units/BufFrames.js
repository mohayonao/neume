import assert from "assert";
import BufFrames from "../../../src/scapi/units/BufFrames";

describe("scapi/units/BufFrames", () => {
  it(".kr should create control rate node", () => {
    const node = BufFrames.kr(1);

    assert.deepEqual(node, {
      type: "BufFrames", rate: "control", props: [ 1 ]
    });
  });

  it(".ir should create scalar rate node", () => {
    const node = BufFrames.ir(1);

    assert.deepEqual(node, {
      type: "BufFrames", rate: "scalar", props: [ 1 ]
    });
  });

  it("default rate is control", () => {
    const node = BufFrames();

    assert.deepEqual(node, {
      type: "BufFrames", rate: "control", props: [ 0 ]
    });
  });
});
