import assert from "assert";
import acos from "../../../src/scapi/operators/acos";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/acos(a)", () => {
  it("numeric", () => {
    const a = 0.5;
    const node = acos(a);

    assert(node === Math.acos(a));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = acos(a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "acos", rate: "audio", props: [ a ]
    });
  });
});
