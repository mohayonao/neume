import assert from "assert";
import MouseX from "../../../src/scapi/units/MouseX";

describe("scapi/units/MouseX", () => {
  it(".kr should create audio rate node", () => {
    const node = MouseX.kr(100, 1000, 0.1, 0.2);

    assert.deepEqual(node, {
      type: "MouseX", rate: "control", props: [ 100, 1000, 0.1, 0.2 ]
    });
  });

  it("default rate is control", () => {
    const node = MouseX();

    assert.deepEqual(node, {
      type: "MouseX", rate: "control", props: [ 0, 1, 0, 0.2 ]
    });
  });
});
