import assert from "assert";
import DelayL from "../../../src/scapi/units/DelayL";
import createNode from "../../../src/scapi/utils/createNode";

describe("scapi/units/DelayL", () => {
  it(".ar should create audio rate node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = DelayL.ar(a, 0.5, 0.1);

    assert.deepEqual(node, {
      type: "DelayL", rate: "audio", props: [ a, 0.5, 0.1 ]
    });
  });

  it(".kr should create control rate node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = DelayL.kr(a, 0.5, 0.1);

    assert.deepEqual(node, {
      type: "DelayL", rate: "control", props: [ a, 0.5, 0.1 ]
    });
  });

  it("default rate is the same as the first input", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = DelayL(a);

    assert.deepEqual(node, {
      type: "DelayL", rate: "audio", props: [ a, 0.2, 0.2 ]
    });
  });
});
