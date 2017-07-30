import assert from "assert";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/createRef";
import checkInputs from "../../../src/scapi/units/_checkInputs";

describe("scapi/units/_checkInputs(index)", () => {
  it("should provide the same rate as first input when rate is null", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = checkInputs(0)("LPF", null, [ a, 1000 ]);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "LPF", rate: "audio", props: [ a, 1000 ]
    });
  });

  it("should use the provided rate when rate is not null", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = checkInputs(0)("LPF", "control", [ a, 1000 ]);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "LPF", rate: "control", props: [ a, 1000 ]
    });
  });

  it("should throw Error when rate is audio but the first input is not audio rate", () => {
    const a = createNode("SinOsc", "control", [ 440, 0 ]);

    assert.throws(() => {
      checkInputs(0)("LPF", "audio", [ a, 1000 ]);
    }, TypeError);
  });
});
