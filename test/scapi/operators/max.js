import assert from "assert";
import max from "../../../src/scapi/operators/max";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/max(a, b)", () => {
  it("numeric", () => {
    const a = 10;
    const b = 20;
    const node = max(a, b);

    assert(node === Math.max(a, b));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = 20;
    const node = max(a, b);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "max", rate: "audio", props: [ a, b ]
    });
  });
});
