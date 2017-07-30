import assert from "assert";
import sinh from "../../../src/scapi/operators/sinh";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/sinh(a)", () => {
  it("numeric", () => {
    const a = 0.5;
    const node = sinh(a);

    assert(node === Math.sinh(a));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = sinh(a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "sinh", rate: "audio", props: [ a ]
    });
  });
});
