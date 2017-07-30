import assert from "assert";
import log2 from "../../../src/scapi/operators/log2";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/log2(a)", () => {
  it("numeric", () => {
    const a = 0.5;
    const node = log2(a);

    assert(node === Math.log2(a));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = log2(a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "log2", rate: "audio", props: [ a ]
    });
  });
});
