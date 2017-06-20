import assert from "assert";
import sin from "../../../src/scapi/operators/sin";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/sin(a)", () => {
  it("numeric", () => {
    const a = 0.5;
    const node = sin(a);

    assert(node === Math.sin(a));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = sin(a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "sin", rate: "audio", props: [ a ]
    });
  });
});
