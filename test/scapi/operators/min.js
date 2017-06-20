import assert from "assert";
import min from "../../../src/scapi/operators/min";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/min(a, b)", () => {
  it("numeric", () => {
    const a = 10;
    const b = 20;
    const node = min(a, b);

    assert(node === Math.min(a, b));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = 20;
    const node = min(a, b);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "min", rate: "audio", props: [ a, b ]
    });
  });
});
