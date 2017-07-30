import assert from "assert";
import AllpassC from "../../../src/scapi/units/AllpassC";
import createNode from "../../../src/scapi/utils/createNode";

describe("scapi/units/AllpassC", () => {
  it(".ar should create audio rate node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = AllpassC.ar(a, 0.5, 0.1, 1.5);

    assert.deepEqual(node, {
      type: "AllpassC", rate: "audio", props: [ a, 0.5, 0.1, 1.5 ]
    });
  });

  it(".kr should create control rate node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = AllpassC.kr(a, 0.5, 0.1, 1.5);

    assert.deepEqual(node, {
      type: "AllpassC", rate: "control", props: [ a, 0.5, 0.1, 1.5 ]
    });
  });

  it("default rate is the same as the first input", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = AllpassC(a);

    assert.deepEqual(node, {
      type: "AllpassC", rate: "audio", props: [ a, 0.2, 0.2, 1 ]
    });
  });
});
