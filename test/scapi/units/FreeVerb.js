import assert from "assert";
import FreeVerb from "../../../src/scapi/units/FreeVerb";
import createNode from "../../../src/scapi/utils/createNode";

describe("scapi/units/FreeVerb", () => {
  it(".ar should create audio rate node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = FreeVerb.ar(a, 0.8, 0.75, 0.25);

    assert.deepEqual(node, {
      type: "FreeVerb", rate: "audio", props: [ a, 0.8, 0.75, 0.25 ]
    });
  });

  it("default rate is the same as the first input", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = FreeVerb(a);

    assert.deepEqual(node, {
      type: "FreeVerb", rate: "audio", props: [ a, 0.33, 0.5, 0.5 ]
    });
  });
});
