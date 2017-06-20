import assert from "assert";
import rand2 from "../../../src/scapi/operators/rand2";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/rand(a)", () => {
  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = rand2(a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "rand2", rate: "audio", props: [ a ]
    });
  });
});
