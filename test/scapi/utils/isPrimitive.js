import assert from "assert";
import isPrimitive from "../../../src/scapi/utils/isPrimitive";

describe("scapi/utils/isPrimitive(value)", () => {
  it("should return true when given a primitive type value", () => {
    assert(isPrimitive(0 )=== true);
    assert(isPrimitive(1) === true);
    assert(isPrimitive(Infinity) === true);
    assert(isPrimitive(NaN) === true);
    assert(isPrimitive("1") === true);
    assert(isPrimitive(null) === true);
  });

  it("should return false when given NOT a primitive type value", () => {
    assert(isPrimitive(it) === false);
    assert(isPrimitive([ 10 ]) === false);
    assert(isPrimitive({ it }) === false);
  });
});
