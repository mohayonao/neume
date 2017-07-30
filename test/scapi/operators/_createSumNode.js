import assert from "assert";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";
import createSumNode from "../../../src/scapi/operators/_createSumNode";

describe("scapi/operators/_createSumNode(...args)", () => {
  it("1 + 2 + 3 = 6", () => {
    const node = createSumNode(1, 2, 3);

    assert(node === 6);
  });

  it("a + 0 = a", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = createSumNode(a, 0);

    assert(node === a);
  });

  it("a + 1 = +(a, 1)", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = createSumNode(a, 1);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "+", rate: "audio", props: [ a, 1 ]
    });
  });


  it("+(a, 1) + 2 = +(a, 3)", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = createSumNode(createSumNode(a, 1), 2);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "+", rate: "audio", props: [ a, 3 ]
    });
  });

  it("MulAdd(a, 2, 3) + 4 = MulAdd(a, 2, 7)", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = createNode("MulAdd", "audio", [ a, 2, 3 ]);
    const node = createSumNode(b, 4);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "MulAdd", rate: "audio", props: [ a, 2, 7 ]
    });
  });

  it("a + b + c = Sum3(a, b, c)", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = createNode("SinOsc", "audio", [ 442, 0 ]);
    const c = createNode("SinOsc", "audio", [ 444, 0 ]);
    const node = createSumNode(a, b, c);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "Sum3", rate: "audio", props: [ a, b, c ]
    });
  });

  it("a + b + c + d = Sum4(a, b, c, d)", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = createNode("SinOsc", "audio", [ 441, 0 ]);
    const c = createNode("SinOsc", "audio", [ 442, 0 ]);
    const d = createNode("SinOsc", "audio", [ 443, 0 ]);
    const node = createSumNode(a, b, c, d);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "Sum4", rate: "audio", props: [ a, b, c, d ]
    });
  });

  it("sum 7 items = +(Sum3, Sum4)", () => {
    const items = Array.from({ length: 7 }, (_, index) => {
      return createNode("SinOsc", "audio", [ 440 + index, 0 ]);
    });
    const node = createSumNode(...items);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "+", rate: "audio", props: [
        { type: "Sum4", rate: "audio", props: [ items[0], items[1], items[2], items[3] ] },
        { type: "Sum3", rate: "audio", props: [ items[4], items[5], items[6] ] },
      ],
    });
  });

  it("should sort items by rate", () => {
    const a = createNode("SinOsc", "control", [ 440, 0 ]);
    const b = createNode("Expand", "scalar", [ 0.01, 0.05 ]);
    const c = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = createSumNode(a, b, c);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "Sum3", rate: "audio", props: [ c, a, b ]
    });
  });
});
