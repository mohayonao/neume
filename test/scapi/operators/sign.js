import assert from "assert";
import sign from "../../../src/scapi/operators/sign";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/sign(a)", () => {
  it("numeric", () => {
    const a = 0.5;
    const node = sign(a);

    assert(node === Math.sign(a));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = sign(a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "sign", rate: "audio", props: [ a ]
    });
  });
});
