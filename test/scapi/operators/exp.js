import assert from "assert";
import exp from "../../../src/scapi/operators/exp";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/exp(a)", () => {
  it("numeric", () => {
    const a = 0.5;
    const node = exp(a);

    assert(node === Math.exp(a));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = exp(a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "exp", rate: "audio", props: [ a ]
    });
  });
});
