import assert from "assert";
import createNode from "../../../src/scapi/utils/createNode";
import createRef from "../../../src/scapi/utils/createRef";
import isSCNode from "../../../src/scapi/utils/isSCNode";
import isSCRef from "../../../src/scapi/utils/isSCRef";
import createOpNode from "../../../src/scapi/operators/_createOpNode";

const max = (a, b) => {
  return createOpNode("max", [ a, b ], (a, b) => Math.max(a, b));
};

const firstArg = (a, b) => {
  return createOpNode("firstArg", [ a, b ], (a, b) => (b, a), true);
};

describe("scapi/operators/_createOpNode(type, args, fn, disableCreateNode)", () => {
  it("should eval when given numeric only", () => {
    assert(max(2, 5) === 5);
  });

  it("should return a same shape array when given array", () => {
    assert.deepEqual(max([ 2, 8 ], [ 5, 6 ]), [ 5, 8 ]);
    assert.deepEqual(max([ 2, 4, [ 6 ] ], 5), [ 5, 5, [ 6 ] ]);
    assert.deepEqual(max(5, [ 2, 4, [ 6 ] ]), [ 5, 5, [ 6 ] ]);
  });

  it("should return a sc.ref when given sc.ref", () => {
    const a = max(createRef(2), 5);
    const b = max(a, [ 3, createRef(10) ]);

    assert(isSCRef(a));
    assert(a.valueOf() === 5);
    assert(Array.isArray(b) && b.length === 2);
    assert(b[0].valueOf() === 5);
    assert(b[1].valueOf() === 10);
  });

  it("should return a sc.node when given sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = max(a, 0.5);

    assert(isSCNode(b));
    assert.deepEqual(b, {
      type: "max", rate: "audio", props: [ a, 0.5, ],
    });
  });

  it("should skip creating node when given 3rd argument is true", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = firstArg(a, 0);

    assert(b === a);
  });

  it("should throw TypeError when given invalid type value", () => {
    assert.throws(() => {
      max(1, "2");
    });
  });
});
