import assert from "assert";
import CombC from "../../../src/scapi/units/CombC";
import createNode from "../../../src/scapi/utils/createNode";

describe("scapi/units/CombC", () => {
  it(".ar should create audio rate node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = CombC.ar(a, 0.5, 0.1, 1.5);

    assert.deepEqual(node, {
      type: "CombC", rate: "audio", props: [ a, 0.5, 0.1, 1.5 ]
    });
  });

  it(".kr should create control rate node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = CombC.kr(a, 0.5, 0.1, 1.5);

    assert.deepEqual(node, {
      type: "CombC", rate: "control", props: [ a, 0.5, 0.1, 1.5 ]
    });
  });

  it("default rate is the same as the first input", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = CombC(a);

    assert.deepEqual(node, {
      type: "CombC", rate: "audio", props: [ a, 0.2, 0.2, 1 ]
    });
  });
});
