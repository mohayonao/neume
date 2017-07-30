import assert from "assert";
import LFNoise0 from "../../../src/scapi/units/LFNoise0";

describe("scapi/units/LFNoise0", () => {
  it(".ar should create audio rate node", () => {
    const node = LFNoise0.ar(200);
    const type = node.type;

    assert(type.startsWith("LFNoise0~"));
    assert.deepEqual(node, {
      type, rate: "audio", props: [ 200 ]
    });
  });

  it(".kr should create control rate node", () => {
    const node = LFNoise0.kr(2);
    const type = node.type;

    assert(type.startsWith("LFNoise0~"));
    assert.deepEqual(node, {
      type, rate: "control", props: [ 2 ]
    });
  });

  it("default rate is control", () => {
    const node = LFNoise0();
    const type = node.type;

    assert(type.startsWith("LFNoise0~"));
    assert.deepEqual(node, {
      type, rate: "control", props: [ 500 ]
    });
  });
});
