import assert from "assert";
import lt from "../../../src/scapi/operators/lt";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/lt(a, b)", () => {
  it("numeric", () => {
    const a = 10;
    const b = 20;
    const node = lt(a, b);

    assert(node === (a < b));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = 20;
    const node = lt(a, b);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "<", rate: "audio", props: [ a, b ]
    });
  });
});
