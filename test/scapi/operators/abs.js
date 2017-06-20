import assert from "assert";
import abs from "../../../src/scapi/operators/abs";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/abs(a)", () => {
  it("numeric", () => {
    const a = 10;
    const node = abs(a);

    assert(node === Math.abs(a));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = abs(a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "abs", rate: "audio", props: [ a ]
    });
  });
});
