import assert from "assert";
import SinOscFB from "../../../src/scapi/units/SinOscFB";

describe("scapi/units/SinOscFB", () => {
  it(".ar should create audio rate node", () => {
    const node = SinOscFB.ar(880, 0.5);

    assert.deepEqual(node, {
      type: "SinOscFB", rate: "audio", props: [ 880, 0.5 ]
    });
  });

  it(".kr should create control rate node", () => {
    const node = SinOscFB.kr(2);

    assert.deepEqual(node, {
      type: "SinOscFB", rate: "control", props: [ 2, 0 ]
    });
  });

  it("default rate is audio", () => {
    const node = SinOscFB();

    assert.deepEqual(node, {
      type: "SinOscFB", rate: "audio", props: [ 440, 0 ]
    });
  });
});
