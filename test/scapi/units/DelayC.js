import assert from "assert";
import DelayC from "../../../src/scapi/units/DelayC";
import createNode from "../../../src/scapi/utils/createNode";

describe("scapi/units/DelayC", () => {
  it(".ar should create audio rate node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = DelayC.ar(a, 0.5, 0.1);

    assert.deepEqual(node, {
      type: "DelayC", rate: "audio", props: [ a, 0.5, 0.1 ]
    });
  });

  it(".kr should create control rate node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = DelayC.kr(a, 0.5, 0.1);

    assert.deepEqual(node, {
      type: "DelayC", rate: "control", props: [ a, 0.5, 0.1 ]
    });
  });

  it("default rate is the same as the first input", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = DelayC(a);

    assert.deepEqual(node, {
      type: "DelayC", rate: "audio", props: [ a, 0.2, 0.2 ]
    });
  });
});
