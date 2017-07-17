import assert from "assert";
import sinon from "sinon";
import psample, { api } from "../../../src/neume/pattern/psample";

describe("neume/pattern/sample(list, repeats)", () => {
  let stub;

  function randAt(list, index) {
    return list[(stub.returnValues[index] * list.length)|0];
  }

  beforeEach(() => {
    stub = sinon.stub(api, "random").callsFake(Math.random);
  });

  afterEach(() => {
    stub.restore();
  });


  it("should create generator function that samples from list", () => {
    const list = [ 1, 2, 3 ];
    const iter = psample(list)();

    assert.deepEqual(iter.next(), { value: randAt(list, 0), done: false });
    assert.deepEqual(iter.next(), { value: randAt(list, 1), done: false });
    assert.deepEqual(iter.next(), { value: randAt(list, 2), done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });

  it("should create generator function that samples from list with length", () => {
    const list = [ 1, 2, 3 ];
    const iter = psample(list, 6)();

    assert.deepEqual(iter.next(), { value: randAt(list, 0), done: false });
    assert.deepEqual(iter.next(), { value: randAt(list, 1), done: false });
    assert.deepEqual(iter.next(), { value: randAt(list, 2), done: false });
    assert.deepEqual(iter.next(), { value: randAt(list, 3), done: false });
    assert.deepEqual(iter.next(), { value: randAt(list, 4), done: false });
    assert.deepEqual(iter.next(), { value: randAt(list, 5), done: false });
    assert.deepEqual(iter.next(), { value: undefined, done: true });
  });
});
