import assert from "assert";
import frac from "../../../src/scapi/operators/frac";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/frac(a)", () => {
  it("numeric", () => {
    const a = 1.5;
    const node = frac(a);

    assert(node === 0.5);
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = frac(a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "frac", rate: "audio", props: [ a ]
    });
  });
});
