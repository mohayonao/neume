import assert from "assert";
import PinkNoise from "../../../src/scapi/units/PinkNoise";

describe("scapi/units/PinkNoise", () => {
  it(".ar should create audio rate node", () => {
    const node = PinkNoise.ar();
    const type = node.type;

    assert(type.startsWith("PinkNoise~"));
    assert.deepEqual(node, {
      type, rate: "audio", props: []
    });
  });

  it(".kr should create control rate node", () => {
    const node = PinkNoise.kr();
    const type = node.type;

    assert(type.startsWith("PinkNoise~"));
    assert.deepEqual(node, {
      type, rate: "control", props: []
    });
  });

  it("default rate is audio", () => {
    const node = PinkNoise();
    const type = node.type;

    assert(type.startsWith("PinkNoise~"));
    assert.deepEqual(node, {
      type, rate: "audio", props: []
    });
  });
});
