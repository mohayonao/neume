import assert from "assert";
import rand from "../../../src/scapi/operators/rand";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/rand(a)", () => {
  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = rand(a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "rand", rate: "audio", props: [ a ]
    });
  });
});
