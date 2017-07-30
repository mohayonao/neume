import assert from "assert";
import toSCNodeInput from "../../../src/scapi/utils/toSCNodeInput";

describe("scapi/utils/toSCNodeInput(value)", () => {
  it("should call .toSCNodeInput() if exists", () => {
    const val = { toSCNodeInput: () => 100 };

    assert(toSCNodeInput(val) === 100);
  });

  it("should call .valueOf() if exists", () => {
    assert(toSCNodeInput(100) === 100);
  });

  it("should return given value directly if not exists both", () => {
    const val = Object.create(null);

    assert(toSCNodeInput(null) === null);
    assert(toSCNodeInput(val) === val);
  });
});
