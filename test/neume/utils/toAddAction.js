import assert from "assert";
import toAddAction from "../../../src/neume/utils/toAddAction";

describe("neumt/utils/toAddAction(value)", () => {
  it("addToHead", () => {
    assert(toAddAction(0) === 0);
    assert(toAddAction("addToHead") === 0);
    assert(toAddAction("addHead") === 0);
    assert(toAddAction("head") === 0);
    assert(toAddAction("h") === 0);
  });

  it("addToTail", () => {
    assert(toAddAction(1) === 1);
    assert(toAddAction("addToTail") === 1);
    assert(toAddAction("addTail") === 1);
    assert(toAddAction("tail") === 1);
    assert(toAddAction("t") === 1);
  });

  it("addBefore", () => {
    assert(toAddAction(2) === 2);
    assert(toAddAction("addBefore") === 2);
    assert(toAddAction("before") === 2);
    assert(toAddAction("b") === 2);
  });

  it("addAfter", () => {
    assert(toAddAction(3) === 3);
    assert(toAddAction("addAfter") === 3);
    assert(toAddAction("after") === 3);
    assert(toAddAction("a") === 3);
  });

  it("addReplace", () => {
    assert(toAddAction(4) === 4);
    assert(toAddAction("addReplace") === 4);
    assert(toAddAction("replace") === 4);
    assert(toAddAction("r") === 4);
  });

  it("else", () => {
    assert(toAddAction(5) === 0);
    assert(toAddAction("unknown") === 0);
  });
});
