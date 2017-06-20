import assert from "assert";
import LFNoise2 from "../../../src/scapi/units/LFNoise2";

describe("scapi/units/LFNoise2", () => {
  it(".ar should create audio rate node", () => {
    const node = LFNoise2.ar(200);
    const type = node.type;

    assert(type.startsWith("LFNoise2~"));
    assert.deepEqual(node, {
      type, rate: "audio", props: [ 200 ]
    });
  });

  it(".kr should create control rate node", () => {
    const node = LFNoise2.kr(2);
    const type = node.type;

    assert(type.startsWith("LFNoise2~"));
    assert.deepEqual(node, {
      type, rate: "control", props: [ 2 ]
    });
  });

  it("default rate is control", () => {
    const node = LFNoise2();
    const type = node.type;

    assert(type.startsWith("LFNoise2~"));
    assert.deepEqual(node, {
      type, rate: "control", props: [ 500 ]
    });
  });
});
