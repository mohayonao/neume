import assert from "assert";
import Phasor from "../../../src/scapi/units/Phasor";

describe("scapi/units/Phasor", () => {
  it(".ar should create audio rate node", () => {
    const node = Phasor.ar(0, 0.95, 0.5, 1, 0.5);

    assert.deepEqual(node, {
      type: "Phasor", rate: "audio", props: [ 0, 0.95, 0.5, 1, 0.5 ]
    });
  });

  it(".kr should create control rate node", () => {
    const node = Phasor.kr(0, 0.95, 0.5, 1, 0.5);

    assert.deepEqual(node, {
      type: "Phasor", rate: "control", props: [ 0, 0.95, 0.5, 1, 0.5 ]
    });
  });

  it("default rate is audio", () => {
    const node = Phasor();

    assert.deepEqual(node, {
      type: "Phasor", rate: "audio", props: [ 0, 1, 0, 1, 0 ]
    });
  });
});
