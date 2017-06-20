import assert from "assert";
import asin from "../../../src/scapi/operators/asin";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/asin(a)", () => {
  it("numeric", () => {
    const a = 0.5;
    const node = asin(a);

    assert(node === Math.asin(a));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = asin(a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "asin", rate: "audio", props: [ a ]
    });
  });
});
