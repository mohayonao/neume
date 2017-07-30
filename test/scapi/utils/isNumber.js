import assert from "assert";
import isNumber from "../../../src/scapi/utils/isNumber";

describe("scapi/utils/isNumber(value)", () => {
  it("should return true when given a number", () => {
    assert(isNumber(0 )=== true);
    assert(isNumber(1) === true);
    assert(isNumber(Infinity) === true);
  });

  it("should return false when given NOT a number", () => {
    assert(isNumber(NaN) === false);
    assert(isNumber("1") === false);
    assert(isNumber(null) === false);
    assert(isNumber(it) === false);
    assert(isNumber([ 10 ]) === false);
    assert(isNumber({ it }) === false);
  });
});
