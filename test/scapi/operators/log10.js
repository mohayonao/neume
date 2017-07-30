import assert from "assert";
import log10 from "../../../src/scapi/operators/log10";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/log10(a)", () => {
  it("numeric", () => {
    const a = 0.5;
    const node = log10(a);

    assert(node === Math.log10(a));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = log10(a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "log10", rate: "audio", props: [ a ]
    });
  });
});
