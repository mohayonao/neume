import assert from "assert";
import TRand from "../../../src/scapi/units/TRand";
import createNode from "../../../src/scapi/utils/createNode";

describe("scapi/units/TRand", () => {
  it(".ar should create audio rate node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = TRand.ar(10, 100, a);
    const type = node.type;

    assert(type.startsWith("TRand~"));
    assert.deepEqual(node, {
      type, rate: "audio", props: [ 10, 100, a ]
    });
  });

  it(".kr should create control rate node", () => {
    const a = createNode("SinOsc", "control", [ 10, 0 ]);
    const node = TRand.kr(10, 100, a);
    const type = node.type;

    assert(type.startsWith("TRand~"));
    assert.deepEqual(node, {
      type, rate: "control", props: [ 10, 100, a ]
    });
  });

  it("default rate is control", () => {
    const node = TRand();
    const type = node.type;

    assert(type.startsWith("TRand~"));
    assert.deepEqual(node, {
      type, rate: "control", props: [ 0, 1, 0 ]
    });
  });
});
