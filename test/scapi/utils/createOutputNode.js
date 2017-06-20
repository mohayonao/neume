import assert from "assert";
import createNode from "../../../src/scapi/utils/createNode";
import createOutputNode from "../../../src/scapi/utils/createOutputNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/utils/createOutputNode(items)", () => {
  it("should return 0 node", () => {
    const node = createOutputNode([
      createNode("Out", "audio", [ 0 ]), createNode("Out", "audio", [ 1 ]),
    ]);

    assert(isSCNode(node));
    assert(node.valueOf() === 0);
    assert.deepEqual(node.props[0], {
      type: "Out", rate: "audio", props: [ 0 ]
    });
    assert.deepEqual(node.props[1], {
      type: "Out", rate: "audio", props: [ 1 ]
    });
  });
});
