import assert from "assert";
import atan from "../../../src/scapi/operators/atan";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/atan(a)", () => {
  it("numeric", () => {
    const a = 0.5;
    const node = atan(a);

    assert(node === Math.atan(a));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = atan(a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "atan", rate: "audio", props: [ a ]
    });
  });
});
