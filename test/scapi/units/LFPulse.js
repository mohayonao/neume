import assert from "assert";
import LFPulse from "../../../src/scapi/units/LFPulse";

describe("scapi/units/LFPulse", () => {
  it(".ar should create audio rate node", () => {
    const node = LFPulse.ar(880, 0.5, 0.2);

    assert.deepEqual(node, {
      type: "LFPulse", rate: "audio", props: [ 880, 0.5, 0.2 ]
    });
  });

  it(".kr should create control rate node", () => {
    const node = LFPulse.kr(2);

    assert.deepEqual(node, {
      type: "LFPulse", rate: "control", props: [ 2, 0, 0.5 ]
    });
  });

  it("default rate is control", () => {
    const node = LFPulse();

    assert.deepEqual(node, {
      type: "LFPulse", rate: "control", props: [ 440, 0, 0.5 ]
    });
  });
});
