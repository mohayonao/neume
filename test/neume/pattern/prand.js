import assert from "assert";
import sinon from "sinon";
import prand, { api } from "../../../src/neume/pattern/prand";

describe("neume/pattern/prand(lo, hi, repeats)", () => {
  let stub;

  function rand(index, lo, hi) {
    return stub.returnValues[index] * (hi - lo) + lo;
  }

  beforeEach(() => {
    stub = sinon.stub(api, "random").callsFake(Math.random);
  });

  afterEach(() => {
    stub.restore();
  });

  it("should create generator function that generate random number", () => {
    const iter = prand()();

    assert.deepEqual(iter.next(), { value: rand(0, 0, 1), done: false });
    assert.deepEqual(iter.next(), { value: rand(1, 0, 1), done: false });
    assert.deepEqual(iter.next(), { value: rand(2, 0, 1), done: false });
    assert.deepEqual(iter.next(), { value: rand(3, 0, 1), done: false });
  });


  it("should create generator function that generate random number (lo, hi)", () => {
    const iter = prand(60, 72, 3)();

    assert.deepEqual(iter.next(), { value: rand(0, 60, 72), done: false });
    assert.deepEqual(iter.next(), { value: rand(1, 60, 72), done: false });
    assert.deepEqual(iter.next(), { value: rand(2, 60, 72), done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });
});
