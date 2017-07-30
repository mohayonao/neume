import assert from "assert";
import LFTri from "../../../src/scapi/units/LFTri";

describe("scapi/units/LFTri", () => {
  it(".ar should create audio rate node", () => {
    const node = LFTri.ar(880, 0.5);

    assert.deepEqual(node, {
      type: "LFTri", rate: "audio", props: [ 880, 0.5 ]
    });
  });

  it(".kr should create control rate node", () => {
    const node = LFTri.kr(2);

    assert.deepEqual(node, {
      type: "LFTri", rate: "control", props: [ 2, 0 ]
    });
  });

  it("default rate is control", () => {
    const node = LFTri();

    assert.deepEqual(node, {
      type: "LFTri", rate: "control", props: [ 440, 0 ]
    });
  });
});
