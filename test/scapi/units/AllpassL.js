import assert from "assert";
import AllpassL from "../../../src/scapi/units/AllpassL";
import createNode from "../../../src/scapi/utils/createNode";

describe("scapi/units/AllpassL", () => {
  it(".ar should create audio rate node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = AllpassL.ar(a, 0.5, 0.1, 1.5);

    assert.deepEqual(node, {
      type: "AllpassL", rate: "audio", props: [ a, 0.5, 0.1, 1.5 ]
    });
  });

  it(".kr should create control rate node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = AllpassL.kr(a, 0.5, 0.1, 1.5);

    assert.deepEqual(node, {
      type: "AllpassL", rate: "control", props: [ a, 0.5, 0.1, 1.5 ]
    });
  });

  it("default rate is the same as the first input", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = AllpassL(a);

    assert.deepEqual(node, {
      type: "AllpassL", rate: "audio", props: [ a, 0.2, 0.2, 1 ]
    });
  });
});
