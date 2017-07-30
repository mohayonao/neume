import assert from "assert";
import cosh from "../../../src/scapi/operators/cosh";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/cosh(a)", () => {
  it("numeric", () => {
    const a = 0.5;
    const node = cosh(a);

    assert(node === Math.cosh(a));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = cosh(a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "cosh", rate: "audio", props: [ a ]
    });
  });
});
