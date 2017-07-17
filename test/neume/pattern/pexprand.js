import assert from "assert";
import sinon from "sinon";
import pexprand, { api } from "../../../src/neume/pattern/pexprand";

describe("neume/pattern/pexprand(lo, hi, repeats)", () => {
  let stub;

  function exprand(index, lo, hi) {
    return lo * Math.exp(stub.returnValues[index] * Math.log(hi / lo));
  }

  beforeEach(() => {
    stub = sinon.stub(api, "random").callsFake(Math.random);
  });

  afterEach(() => {
    stub.restore();
  });

  it("should create generator function that generate exponential random number", () => {
    const iter = pexprand()();

    assert.deepEqual(iter.next(), { value: exprand(0, 0.01, 1), done: false });
    assert.deepEqual(iter.next(), { value: exprand(1, 0.01, 1), done: false });
    assert.deepEqual(iter.next(), { value: exprand(2, 0.01, 1), done: false });
    assert.deepEqual(iter.next(), { value: exprand(3, 0.01, 1), done: false });
  });


  it("should create generator function that generate exponential random number (lo, hi)", () => {
    const iter = pexprand(60, 72, 3)();

    assert.deepEqual(iter.next(), { value: exprand(0, 60, 72), done: false });
    assert.deepEqual(iter.next(), { value: exprand(1, 60, 72), done: false });
    assert.deepEqual(iter.next(), { value: exprand(2, 60, 72), done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });
});
