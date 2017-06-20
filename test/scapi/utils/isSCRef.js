import assert from "assert";
import createRef from "../../../src/scapi/utils/createRef";
import isSCRef from "../../../src/scapi/utils/isSCRef";

describe("scapi/utils/createRef(value)", () => {
  it("should return true when given a sc.ref", () => {
    const a = createRef(() => 100);
    const b = () => 100;

    assert(isSCRef(a) === true);
    assert(isSCRef(b) === false);
  });
});
