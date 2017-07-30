import assert from "assert";
import ref from "../../../src/scapi/api/ref";
import isSCRef from "../../../src/scapi/utils/isSCRef";

describe("scapi/api/ref(value)", () => {
  it("should create a sc.ref", () => {
    const a = ref(100);

    assert(isSCRef(a));
    assert(a.valueOf() === 100);
  });

  it("is an unbinded function", () => {
    const a = ref.call(100);

    assert(isSCRef(a));
    assert(a.valueOf() === 100);
  });
});
