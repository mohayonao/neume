import assert from "assert";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/utils/isSCNode(value)", () => {
  it("should return true when given a sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = JSON.parse(JSON.stringify(a)); // to PlainObject

    assert(isSCNode(a) === true);
    assert(isSCNode(b) === false);
  });
});
