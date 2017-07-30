import assert from "assert";
import tanh from "../../../src/scapi/operators/tanh";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/tanh(a)", () => {
  it("numeric", () => {
    const a = 0.5;
    const node = tanh(a);

    assert(node === Math.tanh(a));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = tanh(a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "tanh", rate: "audio", props: [ a ]
    });
  });
});
