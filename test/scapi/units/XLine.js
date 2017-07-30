import assert from "assert";
import XLine from "../../../src/scapi/units/XLine";

describe("scapi/units/XLine", () => {
  it(".ar should create audio rate node", () => {
    const node = XLine.ar(120, 80, 0.5);

    assert.deepEqual(node, {
      type: "XLine", rate: "audio", props: [ 120, 80, 0.5, 0 ]
    });
  });

  it(".kr should create control rate node", () => {
    const node = XLine.kr(0.5, 0.01, 2, { action: 2 });

    assert.deepEqual(node, {
      type: "XLine", rate: "control", props: [ 0.5, 0.01, 2, 2 ]
    });
  });

  it("default rate is audio", () => {
    const node = XLine();

    assert.deepEqual(node, {
      type: "XLine", rate: "control", props: [ 1, 0.01, 1, 0 ]
    });
  });
});
