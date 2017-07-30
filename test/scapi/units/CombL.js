import assert from "assert";
import CombL from "../../../src/scapi/units/CombL";
import createNode from "../../../src/scapi/utils/createNode";

describe("scapi/units/CombL", () => {
  it(".ar should create audio rate node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = CombL.ar(a, 0.5, 0.1, 1.5);

    assert.deepEqual(node, {
      type: "CombL", rate: "audio", props: [ a, 0.5, 0.1, 1.5 ]
    });
  });

  it(".kr should create control rate node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = CombL.kr(a, 0.5, 0.1, 1.5);

    assert.deepEqual(node, {
      type: "CombL", rate: "control", props: [ a, 0.5, 0.1, 1.5 ]
    });
  });

  it("default rate is the same as the first input", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = CombL(a);

    assert.deepEqual(node, {
      type: "CombL", rate: "audio", props: [ a, 0.2, 0.2, 1 ]
    });
  });
});
