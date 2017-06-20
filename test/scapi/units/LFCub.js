import assert from "assert";
import LFCub from "../../../src/scapi/units/LFCub";

describe("scapi/units/LFCub", () => {
  it(".ar should create audio rate node", () => {
    const node = LFCub.ar(880, 0.5);

    assert.deepEqual(node, {
      type: "LFCub", rate: "audio", props: [ 880, 0.5 ]
    });
  });

  it(".kr should create control rate node", () => {
    const node = LFCub.kr(2);

    assert.deepEqual(node, {
      type: "LFCub", rate: "control", props: [ 2, 0 ]
    });
  });

  it("default rate is control", () => {
    const node = LFCub();

    assert.deepEqual(node, {
      type: "LFCub", rate: "control", props: [ 440, 0 ]
    });
  });
});
