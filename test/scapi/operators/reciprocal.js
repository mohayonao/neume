import assert from "assert";
import reciprocal from "../../../src/scapi/operators/reciprocal";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/reciprocal(a)", () => {
  it("numeric", () => {
    const a = 10;
    const node = reciprocal(a);

    assert(node === (1 / a));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = reciprocal(a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "reciprocal", rate: "audio", props: [ a ]
    });
  });
});
