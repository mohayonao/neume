import assert from "assert";
import LFPar from "../../../src/scapi/units/LFPar";

describe("scapi/units/LFPar", () => {
  it(".ar should create audio rate node", () => {
    const node = LFPar.ar(880, 0.5);

    assert.deepEqual(node, {
      type: "LFPar", rate: "audio", props: [ 880, 0.5 ]
    });
  });

  it(".kr should create control rate node", () => {
    const node = LFPar.kr(2);

    assert.deepEqual(node, {
      type: "LFPar", rate: "control", props: [ 2, 0 ]
    });
  });

  it("default rate is control", () => {
    const node = LFPar();

    assert.deepEqual(node, {
      type: "LFPar", rate: "control", props: [ 440, 0 ]
    });
  });
});
