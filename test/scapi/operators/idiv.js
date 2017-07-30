import assert from "assert";
import idiv from "../../../src/scapi/operators/idiv";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/idiv(a, b)", () => {
  it("numeric", () => {
    const a = 10;
    const b = 20;
    const node = idiv(a, b);

    assert(node === Math.floor(a / b));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = 20;
    const node = idiv(a, b);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "//", rate: "audio", props: [ a, b ]
    });
  });
});
