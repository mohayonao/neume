import assert from "assert";
import toNodeId from "../../../src/neume/utils/toNodeId";

describe("neume/utils/toNodeId(value)", () => {
  it("should return directly when given a number", () => {
    assert(toNodeId(1000) === 1000);
    assert(toNodeId(1001) === 1001);
  });

  it("should return nodeId when given an object", () => {
    assert(toNodeId({ nodeId: 1000 }) === 1000);
    assert(toNodeId({ nodeId: 1001 }) === 1001);
  });

  it("else return 0", () => {
    assert(toNodeId({}) === 0);
  });
});
