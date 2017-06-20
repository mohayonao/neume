import assert from "assert";
import BufRateScale from "../../../src/scapi/units/BufRateScale";

describe("scapi/units/BufRateScale", () => {
  it(".kr should create control rate node", () => {
    const node = BufRateScale.kr(1);

    assert.deepEqual(node, {
      type: "BufRateScale", rate: "control", props: [ 1 ]
    });
  });

  it(".ir should create scalar rate node", () => {
    const node = BufRateScale.ir(1);

    assert.deepEqual(node, {
      type: "BufRateScale", rate: "scalar", props: [ 1 ]
    });
  });

  it("default rate is control", () => {
    const node = BufRateScale();

    assert.deepEqual(node, {
      type: "BufRateScale", rate: "control", props: [ 0 ]
    });
  });
});
