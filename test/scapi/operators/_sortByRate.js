import assert from "assert";
import sortByRate from "../../../src/scapi/operators/_sortByRate";

describe("scapi/operators/_sortByRate(list)", () => {
  it("should sort by rate (audio < control < scalar)", () => {
    const a = sortByRate([
      0, { rate: "audio" }, { rate: "control" }, { rate: "control" }, 0, { rate: "audio" }
    ]);

    assert.deepEqual(a, [
      { rate: "audio" }, { rate: "audio" }, { rate: "control" }, { rate: "control" }, 0, 0
    ]);
  });
});
