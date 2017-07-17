import assert from "assert";
import isGenFunc from "../../../src/neume/utils/isGenFunc";

describe("neume/utils/isGenFunc(value)", () => {
  it("should return true when given is a generator function", () => {
    const gen = function*() {};

    assert(isGenFunc(gen) === true);
  });

  it("should return false when given is not a generator function", () => {
    const func = function() {};

    assert(isGenFunc(func) === false);
    assert(isGenFunc(null) === false);
  });
});
