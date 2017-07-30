import assert from "assert";
import sdefName from "../../../src/neume/utils/sdefName";

describe("neume/utils/sdefName(fn)", () => {
  it("should return function name", () => {
    function beep() {}

    assert(sdefName(beep) === "beep");
  });

  it("should generate temporary name when function not have name", () => {
    assert(typeof sdefName(function() {}) === "string");
    assert(sdefName(function() {}) !== sdefName(function() {}));
  });
});
