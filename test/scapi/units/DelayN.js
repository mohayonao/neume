import assert from "assert";
import DelayN from "../../../src/scapi/units/DelayN";
import createNode from "../../../src/scapi/utils/createNode";

describe("scapi/units/DelayN", () => {
  it(".ar should create audio rate node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = DelayN.ar(a, 0.5, 0.1);

    assert.deepEqual(node, {
      type: "DelayN", rate: "audio", props: [ a, 0.5, 0.1 ]
    });
  });

  it(".kr should create control rate node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = DelayN.kr(a, 0.5, 0.1);

    assert.deepEqual(node, {
      type: "DelayN", rate: "control", props: [ a, 0.5, 0.1 ]
    });
  });

  it("default rate is the same as the first input", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = DelayN(a);

    assert.deepEqual(node, {
      type: "DelayN", rate: "audio", props: [ a, 0.2, 0.2 ]
    });
  });
});
