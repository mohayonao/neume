import assert from "assert";
import SinOsc from "../../../src/scapi/units/SinOsc";

describe("scapi/units/SinOsc", () => {
  it(".ar should create audio rate node", () => {
    const node = SinOsc.ar(880, 0.5);

    assert.deepEqual(node, {
      type: "SinOsc", rate: "audio", props: [ 880, 0.5 ]
    });
  });

  it(".kr should create control rate node", () => {
    const node = SinOsc.kr(2);

    assert.deepEqual(node, {
      type: "SinOsc", rate: "control", props: [ 2, 0 ]
    });
  });

  it("default rate is audio", () => {
    const node = SinOsc();

    assert.deepEqual(node, {
      type: "SinOsc", rate: "audio", props: [ 440, 0 ]
    });
  });
});
