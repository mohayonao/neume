import assert from "assert";
import cos from "../../../src/scapi/operators/cos";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/cos(a)", () => {
  it("numeric", () => {
    const a = 0.5;
    const node = cos(a);

    assert(node === Math.cos(a));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = cos(a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "cos", rate: "audio", props: [ a ]
    });
  });
});
