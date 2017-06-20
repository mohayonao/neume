import assert from "assert";
import LFSaw from "../../../src/scapi/units/LFSaw";

describe("scapi/units/LFSaw", () => {
  it(".ar should create audio rate node", () => {
    const node = LFSaw.ar(880, 0.5);

    assert.deepEqual(node, {
      type: "LFSaw", rate: "audio", props: [ 880, 0.5 ]
    });
  });

  it(".kr should create control rate node", () => {
    const node = LFSaw.kr(2);

    assert.deepEqual(node, {
      type: "LFSaw", rate: "control", props: [ 2, 0 ]
    });
  });

  it("default rate is control", () => {
    const node = LFSaw();

    assert.deepEqual(node, {
      type: "LFSaw", rate: "control", props: [ 440, 0 ]
    });
  });
});
