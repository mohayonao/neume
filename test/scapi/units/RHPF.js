import assert from "assert";
import RHPF from "../../../src/scapi/units/RHPF";
import createNode from "../../../src/scapi/utils/createNode";

describe("scapi/units/RHPF", () => {
  it(".ar should create audio rate node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = RHPF.ar(a, 1000, 2);

    assert.deepEqual(node, {
      type: "RHPF", rate: "audio", props: [ a, 1000, 2 ]
    });
  });

  it(".kr should create control rate node", () => {
    const a = createNode("SinOsc", "control", [ 440, 0 ]);
    const node = RHPF.kr(a, 1000, 2);

    assert.deepEqual(node, {
      type: "RHPF", rate: "control", props: [ a, 1000, 2 ]
    });
  });

  it("default rate is the same as the first input", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = RHPF(a);

    assert.deepEqual(node, {
      type: "RHPF", rate: "audio", props: [ a, 440, 1 ]
    });
  });
});
