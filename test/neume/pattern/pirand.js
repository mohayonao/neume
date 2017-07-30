import assert from "assert";
import sinon from "sinon";
import pirand, { api } from "../../../src/neume/pattern/pirand";

describe("neume/pattern/pirand(lo, hi, repeats)", () => {
  let stub;

  function irand(index, lo, hi) {
    return Math.floor(stub.returnValues[index] * (hi - lo) + lo);
  }

  beforeEach(() => {
    stub = sinon.stub(api, "random").callsFake(Math.random);
  });

  afterEach(() => {
    stub.restore();
  });

  it("should create generator function that generate random integer", () => {
    const iter = pirand()();

    assert.deepEqual(iter.next(), { value: irand(0, 0, 127), done: false });
    assert.deepEqual(iter.next(), { value: irand(1, 0, 127), done: false });
    assert.deepEqual(iter.next(), { value: irand(2, 0, 127), done: false });
    assert.deepEqual(iter.next(), { value: irand(3, 0, 127), done: false });
  });


  it("should create generator function that generate random integer (lo, hi)", () => {
    const iter = pirand(60, 72, 3)();

    assert.deepEqual(iter.next(), { value: irand(0, 60, 72), done: false });
    assert.deepEqual(iter.next(), { value: irand(1, 60, 72), done: false });
    assert.deepEqual(iter.next(), { value: irand(2, 60, 72), done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });
});
