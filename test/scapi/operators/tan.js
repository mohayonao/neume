import assert from "assert";
import tan from "../../../src/scapi/operators/tan";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/tan(a)", () => {
  it("numeric", () => {
    const a = 0.5;
    const node = tan(a);

    assert(node === Math.tan(a));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = tan(a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "tan", rate: "audio", props: [ a ]
    });
  });
});
