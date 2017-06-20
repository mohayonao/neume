import assert from "assert";
import createNode from "../../../src/scapi/utils/createNode";
import createRef from "../../../src/scapi/utils/createRef";
import isSCNode from "../../../src/scapi/utils/createRef";
import isSCRef from "../../../src/scapi/utils/isSCRef";

describe("scapi/utils/createNode(type, rate, props)", () => {
  it("should create a sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);

    assert(isSCNode(a));
    assert.deepEqual(a, {
      type: "SinOsc", rate: "audio", props: [ 440, 0 ]
    });
  });

  it("should create a nested sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = createNode("Delay1", "audio", [ a ]);

    assert.deepEqual(b, {
      type: "Delay1", rate: "audio", props: [
        { type: "SinOsc", rate: "audio", props: [ 440, 0 ] }
      ]
    });
  });

  it("should create a random sc.node when `type` ends with ~", () => {
    const a = createNode("WhiteNoise~", "audio");
    const b = createNode("WhiteNoise~", "audio");

    assert(isSCNode(a));
    assert(isSCNode(b));
    assert(/^WhiteNoise~\d+/.test(a.type));
    assert(/^WhiteNoise~\d+/.test(b.type));
    assert(a.type !== b.type);
  });

  it("should create a sc.ref when given sc.ref", () => {
    const a = createNode("SinOsc", "audio", [ createRef(440), 0 ]);

    assert(isSCRef(a));
    assert(isSCNode(a.valueOf()));
    assert.deepEqual(a.valueOf(), {
      type: "SinOsc", rate: "audio", props: [ 440, 0 ]
    });
  });

  it("should throw TypeError when given invalid inputs", () => {
    assert.throws(() => {
      createNode("SinOsc", "audio", [ [ 440, 442 ], 0 ]);
    }, TypeError);
  });
});
