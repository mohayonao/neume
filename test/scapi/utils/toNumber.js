import assert from "assert";
import toNumber from "../../../src/scapi/utils/toNumber";

describe("scapi/utils/toNumber(value)", () => {
  it("should return a number", () => {
    assert(toNumber(100) === 100);
    assert(toNumber("0") === 0);
    assert(toNumber([ 10 ]) === 10); // ...
    assert(toNumber([ 10, 20 ]) === 0); // ...
    assert(toNumber(null) === 0);
  });
});
