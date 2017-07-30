import assert from "assert";
import toNumber from "../../../src/neume/utils/toNumber";

describe("neumt/utils/toNumber(value)", () => {
  it("should convert to number", () => {
    assert(toNumber(0) === 0);
    assert(toNumber("0") === 0);
    assert(toNumber(NaN) === 0);
    assert(toNumber(null) === 0);
  });
});
