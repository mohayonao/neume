import assert from "assert";
import Line from "../../../src/scapi/units/Line";

describe("scapi/units/Line", () => {
  it(".ar should create audio rate node", () => {
    const node = Line.ar(120, 80, 0.5);

    assert.deepEqual(node, {
      type: "Line", rate: "audio", props: [ 120, 80, 0.5, 0 ]
    });
  });

  it(".kr should create control rate node", () => {
    const node = Line.kr(0.5, 0, 2, { action: 2 });

    assert.deepEqual(node, {
      type: "Line", rate: "control", props: [ 0.5, 0, 2, 2 ]
    });
  });

  it("default rate is audio", () => {
    const node = Line();

    assert.deepEqual(node, {
      type: "Line", rate: "control", props: [ 1, 0, 1, 0 ]
    });
  });
});
