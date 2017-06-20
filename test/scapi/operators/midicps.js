import assert from "assert";
import midicps from "../../../src/scapi/operators/midicps";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/midicps(a)", () => {
  it("numeric", () => {
    const a = 69;
    const node = midicps(a);

    assert(node === 440);
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = midicps(a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "midicps", rate: "audio", props: [ a ]
    });
  });
});
