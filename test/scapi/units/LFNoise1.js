import assert from "assert";
import LFNoise1 from "../../../src/scapi/units/LFNoise1";

describe("scapi/units/LFNoise1", () => {
  it(".ar should create audio rate node", () => {
    const node = LFNoise1.ar(200);
    const type = node.type;

    assert(type.startsWith("LFNoise1~"));
    assert.deepEqual(node, {
      type, rate: "audio", props: [ 200 ]
    });
  });

  it(".kr should create control rate node", () => {
    const node = LFNoise1.kr(2);
    const type = node.type;

    assert(type.startsWith("LFNoise1~"));
    assert.deepEqual(node, {
      type, rate: "control", props: [ 2 ]
    });
  });

  it("default rate is control", () => {
    const node = LFNoise1();
    const type = node.type;

    assert(type.startsWith("LFNoise1~"));
    assert.deepEqual(node, {
      type, rate: "control", props: [ 500 ]
    });
  });
});
