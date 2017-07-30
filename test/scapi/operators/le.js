import assert from "assert";
import le from "../../../src/scapi/operators/le";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/le(a, b)", () => {
  it("numeric", () => {
    const a = 10;
    const b = 20;
    const node = le(a, b);

    assert(node === (a <= b));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = 20;
    const node = le(a, b);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "<=", rate: "audio", props: [ a, b ]
    });
  });
});
