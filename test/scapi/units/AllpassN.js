import assert from "assert";
import AllpassN from "../../../src/scapi/units/AllpassN";
import createNode from "../../../src/scapi/utils/createNode";

describe("scapi/units/AllpassN", () => {
  it(".ar should create audio rate node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = AllpassN.ar(a, 0.5, 0.1, 1.5);

    assert.deepEqual(node, {
      type: "AllpassN", rate: "audio", props: [ a, 0.5, 0.1, 1.5 ]
    });
  });

  it(".kr should create control rate node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = AllpassN.kr(a, 0.5, 0.1, 1.5);

    assert.deepEqual(node, {
      type: "AllpassN", rate: "control", props: [ a, 0.5, 0.1, 1.5 ]
    });
  });

  it("default rate is the same as the first input", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = AllpassN(a);

    assert.deepEqual(node, {
      type: "AllpassN", rate: "audio", props: [ a, 0.2, 0.2, 1 ]
    });
  });
});
