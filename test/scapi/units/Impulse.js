import assert from "assert";
import Impulse from "../../../src/scapi/units/Impulse";

describe("scapi/units/Impulse", () => {
  it(".ar should create audio rate node", () => {
    const node = Impulse.ar(880, 0.5);

    assert.deepEqual(node, {
      type: "Impulse", rate: "audio", props: [ 880, 0.5 ]
    });
  });

  it(".kr should create control rate node", () => {
    const node = Impulse.kr(2);

    assert.deepEqual(node, {
      type: "Impulse", rate: "control", props: [ 2, 0 ]
    });
  });

  it("default rate is audio", () => {
    const node = Impulse();

    assert.deepEqual(node, {
      type: "Impulse", rate: "audio", props: [ 440, 0 ]
    });
  });
});
