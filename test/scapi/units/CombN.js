import assert from "assert";
import CombN from "../../../src/scapi/units/CombN";
import createNode from "../../../src/scapi/utils/createNode";

describe("scapi/units/CombN", () => {
  it(".ar should create audio rate node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = CombN.ar(a, 0.5, 0.1, 1.5);

    assert.deepEqual(node, {
      type: "CombN", rate: "audio", props: [ a, 0.5, 0.1, 1.5 ]
    });
  });

  it(".kr should create control rate node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = CombN.kr(a, 0.5, 0.1, 1.5);

    assert.deepEqual(node, {
      type: "CombN", rate: "control", props: [ a, 0.5, 0.1, 1.5 ]
    });
  });

  it("default rate is the same as the first input", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = CombN(a);

    assert.deepEqual(node, {
      type: "CombN", rate: "audio", props: [ a, 0.2, 0.2, 1 ]
    });
  });
});
