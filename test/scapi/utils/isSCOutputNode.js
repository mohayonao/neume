import assert from "assert";
import createNode from "../../../src/scapi/utils/createNode";
import createOutputNode from "../../../src/scapi/utils/createOutputNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";
import isSCOutputNode from "../../../src/scapi/utils/isSCOutputNode";

describe("scapi/utils/isSCOutputNode(value)", () => {
  it("should return true when given a sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = createOutputNode(a);
    const c = JSON.parse(JSON.stringify(b)); // to PlainObject

    assert(isSCNode(a) === true);
    assert(isSCOutputNode(a) === false);
    assert(isSCNode(a) === true);
    assert(isSCOutputNode(b) === true);
    assert(isSCNode(c) === false);
    assert(isSCOutputNode(c) === false);
  });
});
