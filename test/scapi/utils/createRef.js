import assert from "assert";
import createRef from "../../../src/scapi/utils/createRef";
import isSCRef from "../../../src/scapi/utils/isSCRef";

describe("scapi/utils/createRef(value)", () => {
  it("should create a sc.ref", () => {
    const a = createRef(100);

    assert(a !== 100);
    assert(a.valueOf() === 100);
    assert(isSCRef(a));
  });

  it("should bless sc.ref flag when given a function", () => {
    const fn = () => 100;
    const a = createRef(fn);

    assert(a === fn);
    assert(a.valueOf() === 100);
    assert(isSCRef(a));
  });

  it("should throw TypeError when given function that need arguments", () => {
    const fn = a => a;

    assert.throws(() => {
      createRef(fn);
    }, TypeError);
  });
});
