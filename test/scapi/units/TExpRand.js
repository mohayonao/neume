import assert from "assert";
import TExpRand from "../../../src/scapi/units/TExpRand";
import createNode from "../../../src/scapi/utils/createNode";

describe("scapi/units/TExpRand", () => {
  it(".ar should create audio rate node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = TExpRand.ar(1, 2, a);
    const type = node.type;

    assert(type.startsWith("TExpRand~"));
    assert.deepEqual(node, {
      type, rate: "audio", props: [ 1, 2, a ]
    });
  });

  it(".kr should create control rate node", () => {
    const a = createNode("SinOsc", "control", [ 10, 0 ]);
    const node = TExpRand.kr(1, 2, a);
    const type = node.type;

    assert(type.startsWith("TExpRand~"));
    assert.deepEqual(node, {
      type, rate: "control", props: [ 1, 2, a ]
    });
  });

  it("default rate is control", () => {
    const node = TExpRand();
    const type = node.type;

    assert(type.startsWith("TExpRand~"));
    assert.deepEqual(node, {
      type, rate: "control", props: [ 0.01, 1, 0 ]
    });
  });
});
