import assert from "assert";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";
import multiOut from "../../../src/scapi/units/_multiOut";

describe("scapi/units/_multiOut(node, length)", () => {
  it("should return an array that contains OutputProxy", () => {
    const a = createNode("Pan2", "audio", [ 0 ]);
    const node = multiOut(a, 2);

    assert(Array.isArray(node) && node.length === 2);
    assert(isSCNode(node[0]));
    assert(isSCNode(node[1]));
    assert.deepEqual(node[0], {
      type: "OutputProxy", rate: "audio", props: [ a, 0, 2 ]
    });
    assert.deepEqual(node[1], {
      type: "OutputProxy", rate: "audio", props: [ a, 1, 2 ]
    });
  });

  it("should return an array that contains same shape (inputs)", () => {
    const a = createNode("Pan2", "audio", [ 0 ]);
    const b = createNode("Pan2", "audio", [ 1 ]);
    const node = multiOut([ a, b ], 2);

    assert(Array.isArray(node) && node.length === 2);
    assert(Array.isArray(node[0]) && node[0].length === 2);
    assert.deepEqual(node[0][0], {
      type: "OutputProxy", rate: "audio", props: [ a, 0, 2 ]
    });
    assert.deepEqual(node[0][1], {
      type: "OutputProxy", rate: "audio", props: [ a, 1, 2 ]
    });
    assert.deepEqual(node[1][0], {
      type: "OutputProxy", rate: "audio", props: [ b, 0, 2 ]
    });
    assert.deepEqual(node[1][1], {
      type: "OutputProxy", rate: "audio", props: [ b, 1, 2 ]
    });
  });

  it("should return an array that contains same shape (channels)", () => {
    const a = createNode("Pan2", "audio", [ 0 ]);
    const node = multiOut(a, [ 4, 2 ]);

    assert(Array.isArray(node) && node.length === 2);
    assert(Array.isArray(node[0]) && node[0].length === 4);
    assert(Array.isArray(node[1]) && node[1].length === 2);
    assert.deepEqual(node[0][0], {
      type: "OutputProxy", rate: "audio", props: [ a, 0, 4 ],
    });
    assert.deepEqual(node[0][1], {
      type: "OutputProxy", rate: "audio", props: [ a, 1, 4 ],
    });
    assert.deepEqual(node[0][2], {
      type: "OutputProxy", rate: "audio", props: [ a, 2, 4 ],
    });
    assert.deepEqual(node[0][3], {
      type: "OutputProxy", rate: "audio", props: [ a, 3, 4 ],
    });
    assert.deepEqual(node[1][0], {
      type: "OutputProxy", rate: "audio", props: [ a, 0, 2 ],
    });
    assert.deepEqual(node[1][1], {
      type: "OutputProxy", rate: "audio", props: [ a, 1, 2 ],
    });
  });

  it("should return an array that contains same shape (inputs * channels)", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = createNode("SinOsc", "audio", [ 442, 0 ]);
    const node = multiOut([ a, b ], [ 4, 2 ]);

    assert(Array.isArray(node) && node.length === 2);
    assert(Array.isArray(node[0]) && node[0].length === 4);
    assert(Array.isArray(node[1]) && node[1].length === 2);
    assert.deepEqual(node[0][0], {
      type: "OutputProxy", rate: "audio", props: [ a, 0, 4 ],
    });
    assert.deepEqual(node[0][1], {
      type: "OutputProxy", rate: "audio", props: [ a, 1, 4 ],
    });
    assert.deepEqual(node[0][2], {
      type: "OutputProxy", rate: "audio", props: [ a, 2, 4 ],
    });
    assert.deepEqual(node[0][3], {
      type: "OutputProxy", rate: "audio", props: [ a, 3, 4 ],
    });
    assert.deepEqual(node[1][0], {
      type: "OutputProxy", rate: "audio", props: [ b, 0, 2 ],
    });
    assert.deepEqual(node[1][1], {
      type: "OutputProxy", rate: "audio", props: [ b, 1, 2 ],
    });
  });

  it("should return an OutputProxy (not Array) when single output", () => {
    const a = createNode("In", "audio", [ 0 ]);
    const node = multiOut(a, 1);

    assert.deepEqual(node, {
      type: "OutputProxy", rate: "audio", props: [ a, 0, 1 ],
    });
    assert.deepEqual(multiOut([ a ], 1), node);
    assert.deepEqual(multiOut(a, [ 1 ]), node);
    assert.deepEqual(multiOut([ a ], [ 1 ]), node);
  });
});
