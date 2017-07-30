import assert from "assert";
import wrapAt from "../../../src/scapi/utils/wrapAt";

describe("scapi/utils/wrapAt(list, index)", () => {
  it("should return a value at wrapped index in the list", () => {
    const a = [ 0, 10, 20, 30 ];

    assert(wrapAt(a, 0) === 0);
    assert(wrapAt(a, 4) === 0);
    assert(wrapAt(a, 5) === 10);
  });

  it("should return directly when value is scalar", () => {
    assert(wrapAt(10, 0) === 10);
  });
});
