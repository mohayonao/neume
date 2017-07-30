import assert from "assert";
import isOSCBundle from "../../../src/scsynth/utils/isOSCBundle";

describe("scsynth/utils/isOSCBundle(value)", () => {
  it("should return true when value is OSC bundle", () => {
    assert(isOSCBundle({ timetag: [ 0, 1 ], elements: [] }) === true);
    assert(isOSCBundle({ address: "/foo" }) === false);
  });
});
