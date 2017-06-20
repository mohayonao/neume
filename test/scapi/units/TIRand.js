import assert from "assert";
import TIRand from "../../../src/scapi/units/TIRand";
import createNode from "../../../src/scapi/utils/createNode";

describe("scapi/units/TIRand", () => {
  it(".ar should create audio rate node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = TIRand.ar(10, 100, a);
    const type = node.type;

    assert(type.startsWith("TIRand~"));
    assert.deepEqual(node, {
      type, rate: "audio", props: [ 10, 100, a ]
    });
  });

  it(".kr should create control rate node", () => {
    const a = createNode("SinOsc", "control", [ 10, 0 ]);
    const node = TIRand.kr(10, 100, a);
    const type = node.type;

    assert(type.startsWith("TIRand~"));
    assert.deepEqual(node, {
      type, rate: "control", props: [ 10, 100, a ]
    });
  });

  it("default rate is control", () => {
    const node = TIRand();
    const type = node.type;

    assert(type.startsWith("TIRand~"));
    assert.deepEqual(node, {
      type, rate: "control", props: [ 0, 127, 0 ]
    });
  });
});
