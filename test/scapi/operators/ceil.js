import assert from "assert";
import ceil from "../../../src/scapi/operators/ceil";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/ceil(a)", () => {
  it("numeric", () => {
    const a = 0.5;
    const node = ceil(a);

    assert(node === Math.ceil(a));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = ceil(a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "ceil", rate: "audio", props: [ a ]
    });
  });
});
