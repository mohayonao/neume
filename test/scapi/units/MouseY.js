import assert from "assert";
import MouseY from "../../../src/scapi/units/MouseY";

describe("scapi/units/MouseY", () => {
  it(".kr should create audio rate node", () => {
    const node = MouseY.kr(100, 1000, 0.1, 0.2);

    assert.deepEqual(node, {
      type: "MouseY", rate: "control", props: [ 100, 1000, 0.1, 0.2 ]
    });
  });

  it("default rate is control", () => {
    const node = MouseY();

    assert.deepEqual(node, {
      type: "MouseY", rate: "control", props: [ 0, 1, 0, 0.2 ]
    });
  });
});
