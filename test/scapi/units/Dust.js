import assert from "assert";
import Dust from "../../../src/scapi/units/Dust";

describe("scapi/units/Dust", () => {
  it(".ar should create audio rate node", () => {
    const node = Dust.ar(200);
    const type = node.type;

    assert(type.startsWith("Dust~"));
    assert.deepEqual(node, {
      type, rate: "audio", props: [ 200 ]
    });
  });

  it(".kr should create control rate node", () => {
    const node = Dust.kr(5);
    const type = node.type;

    assert(type.startsWith("Dust~"));
    assert.deepEqual(node, {
      type, rate: "control", props: [ 5 ]
    });
  });

  it("default rate is audio", () => {
    const node = Dust();
    const type = node.type;

    assert(type.startsWith("Dust~"));
    assert.deepEqual(node, {
      type, rate: "audio", props: [ 0 ]
    });
  });
});
