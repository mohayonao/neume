import assert from "assert";
import sqrt from "../../../src/scapi/operators/sqrt";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/sqrt(a)", () => {
  it("numeric", () => {
    const a = 0.5;
    const node = sqrt(a);

    assert(node === Math.sqrt(a));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = sqrt(a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "sqrt", rate: "audio", props: [ a ]
    });
  });
});
