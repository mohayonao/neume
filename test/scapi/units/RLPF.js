import assert from "assert";
import RLPF from "../../../src/scapi/units/RLPF";
import createNode from "../../../src/scapi/utils/createNode";

describe("scapi/units/RLPF", () => {
  it(".ar should create audio rate node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = RLPF.ar(a, 1000, 2);

    assert.deepEqual(node, {
      type: "RLPF", rate: "audio", props: [ a, 1000, 2 ]
    });
  });

  it(".kr should create control rate node", () => {
    const a = createNode("SinOsc", "control", [ 440, 0 ]);
    const node = RLPF.kr(a, 1000, 2);

    assert.deepEqual(node, {
      type: "RLPF", rate: "control", props: [ a, 1000, 2 ]
    });
  });

  it("default rate is the same as the first input", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = RLPF(a);

    assert.deepEqual(node, {
      type: "RLPF", rate: "audio", props: [ a, 440, 1 ]
    });
  });
});
