import assert from "assert";
import isSDefJSON from "../../../src/neume/utils/isSDefJSON";

describe("neume/utils/isSDefJSON(value)", () => {
  it("should return true when given sdef json likely", () => {
    assert(isSDefJSON({ name: "temp", consts: [], units: [] }) === true);
  });

  it("should return false when given NOT sdef json likely", () => {
    assert(isSDefJSON(null) === false);
    assert(isSDefJSON({ address: "/foo", args: [] }) === false);
  });
});
