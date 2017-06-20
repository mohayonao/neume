import assert from "assert";
import isPlainObject from "../../../src/scapi/utils/isPlainObject";

describe("scapi/utils/isPlainObject(value)", () => {
  it("should return true when given a plain object", () => {
    assert(isPlainObject({ it }) === true);
  });

  it("should return false when given NOT a plain object", () => {
    assert(isPlainObject(null) === false);
    assert(isPlainObject(it) === false);
    assert(isPlainObject([ 10 ]) === false);
    assert(isPlainObject(Object.create({})) ===false);
  });
});
