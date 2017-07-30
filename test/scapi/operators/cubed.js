import assert from "assert";
import cubed from "../../../src/scapi/operators/cubed";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/cubed(a)", () => {
  it("numeric", () => {
    const a = 10;
    const node = cubed(a);

    assert(node === (a * a * a));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = cubed(a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "cubed", rate: "audio", props: [ a ]
    });
  });
});
