import assert from "assert";
import neg from "../../../src/scapi/operators/neg";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/neg(a)", () => {
  it("numeric", () => {
    const a = 10;
    const node = neg(a);

    assert(node === -a);
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = neg(a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "neg", rate: "audio", props: [ a ]
    });
  });
});
