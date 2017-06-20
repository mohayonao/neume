import assert from "assert";
import dup from "../../../src/scapi/api/dup";

describe("scapi/api/dup(value, length)", () => {
  it("should create copies", () => {
    const a = 10;
    const b = dup(a);

    assert.deepEqual(b, [ a, a ]);
  });

  it("is an unbinded function", () => {
    const a = 10;
    const b = dup.call(a, 4);

    assert.deepEqual(b, [ a, a, a, a ]);
  });
});
