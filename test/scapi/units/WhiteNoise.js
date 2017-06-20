import assert from "assert";
import WhiteNoise from "../../../src/scapi/units/WhiteNoise";

describe("scapi/units/WhiteNoise", () => {
  it(".ar should create audio rate node", () => {
    const node = WhiteNoise.ar();
    const type = node.type;

    assert(type.startsWith("WhiteNoise~"));
    assert.deepEqual(node, {
      type, rate: "audio", props: []
    });
  });

  it(".kr should create control rate node", () => {
    const node = WhiteNoise.kr();
    const type = node.type;

    assert(type.startsWith("WhiteNoise~"));
    assert.deepEqual(node, {
      type, rate: "control", props: []
    });
  });

  it("default rate is audio", () => {
    const node = WhiteNoise();
    const type = node.type;

    assert(type.startsWith("WhiteNoise~"));
    assert.deepEqual(node, {
      type, rate: "audio", props: []
    });
  });
});
