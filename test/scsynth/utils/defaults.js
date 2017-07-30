import assert from "assert";
import defaults from "../../../src/scsynth/utils/defaults";

describe("scsynth/utils/defaults(value, defaultValue)", () => {
  it("works", () => {
    assert(defaults(0, 1) === 0);
    assert(defaults(null, 1) === null);
    assert(defaults(undefined, 1) === 1);
  });
});
