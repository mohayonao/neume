import assert from "assert";
import ctl from "../../../src/scapi/api/ctl";
import isSCNode from "../../../src/scapi/utils/isSCNode";

describe("scapi/api/ctl(name, value)", () => {
  it("should create a control rate Control", () => {
    const a = ctl("freq", 440);

    assert.deepEqual(a, {
      type: "#freq", rate: "control", props: [ 440, 0, 1 ]
    });
    assert(isSCNode(a));
  });

  it("should create Controls when given an array", () => {
    const a = ctl("freq", [ 440, 442 ]);

    assert.deepEqual(a, [
      { type: "#freq", rate: "control", props: [ 440, 0, 2 ] },
      { type: "#freq", rate: "control", props: [ 442, 1, 2 ] },
    ]);
  });

  it(".ar should create a control rate Control", () => {
    const a = ctl.ar("freq", 440);

    assert.deepEqual(a, {
      type: "#freq", rate: "audio", props: [ 440, 0, 1 ]
    });
    assert(isSCNode(a));
  });

  it(".kr should create a audio rate Control", () => {
    const a = ctl.kr("freq", 440);

    assert.deepEqual(a, {
      type: "#freq", rate: "control", props: [ 440, 0, 1 ]
    });
    assert(isSCNode(a));
  });

  it(".ir should create a scalar rate Control", () => {
    const a = ctl.ir("freq", 440);

    assert.deepEqual(a, {
      type: "#freq", rate: "scalar", props: [ 440, 0, 1 ]
    });
    assert(isSCNode(a));
  });

  it(".tr should create a trigger Control", () => {
    const a = ctl.tr("freq", 440);

    assert.deepEqual(a, {
      type: "!freq", rate: "control", props: [ 1, 0, 1 ]
    });
    assert(isSCNode(a));
  });

  it("should throw an TypeError when given invalid name", () => {
    assert.throws(() => {
      ctl("(x'_'x)");
    }, TypeError);
  });
});
