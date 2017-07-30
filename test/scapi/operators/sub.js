import assert from "assert";
import sub from "../../../src/scapi/operators/sub";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/operators/sub(a, b)", () => {
  it("numeric", () => {
    const a = 10;
    const b = 20;
    const node = sub(a, b);

    assert(node === (a - b));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = 20;
    const node = sub(a, b);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "-", rate: "audio", props: [ a, b ]
    });
  });
});
