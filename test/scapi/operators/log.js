import assert from "assert";
import log from "../../../src/scapi/operators/log";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/log(a)", () => {
  it("numeric", () => {
    const a = 0.5;
    const node = log(a);

    assert(node === Math.log(a));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = log(a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "log", rate: "audio", props: [ a ]
    });
  });
});
