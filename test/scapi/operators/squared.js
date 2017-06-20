import assert from "assert";
import squared from "../../../src/scapi/operators/squared";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/squared(a)", () => {
  it("numeric", () => {
    const a = 10;
    const node = squared(a);

    assert(node === (a * a));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = squared(a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "squared", rate: "audio", props: [ a ]
    });
  });
});
