import assert from "assert";
import floor from "../../../src/scapi/operators/floor";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/floor(a)", () => {
  it("numeric", () => {
    const a = 0.5;
    const node = floor(a);

    assert(node === Math.floor(a));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = floor(a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "floor", rate: "audio", props: [ a ]
    });
  });
});
