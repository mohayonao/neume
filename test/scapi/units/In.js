import assert from "assert";
import In from "../../../src/scapi/units/In";
import createNode from "../../../src/scapi/utils/createNode";

describe("scapi/units/In", () => {
  it(".ar should create audio multi out node", () => {
    const src = createNode("In", "audio", [ 0 ]);
    const node = In.ar(0, 2);

    assert(Array.isArray(node) && node.length === 2);
    assert.deepEqual(node[0], {
      type: "OutputProxy", rate: "audio", props: [ src, 0, 2 ]
    });
    assert.deepEqual(node[1], {
      type: "OutputProxy", rate: "audio", props: [ src, 1, 2 ]
    });
    assert(node[0].props[0] === node[1].props[0]);
  });

  it(".kr should create control multi out node", () => {
    const src = createNode("In", "audio", [ 0 ]);
    const node = In.ar(0, 2);

    assert(Array.isArray(node) && node.length === 2);
    assert.deepEqual(node[0], {
      type: "OutputProxy", rate: "audio", props: [ src, 0, 2 ]
    });
    assert.deepEqual(node[1], {
      type: "OutputProxy", rate: "audio", props: [ src, 1, 2 ]
    });
    assert(node[0].props[0] === node[1].props[0]);
  });

  it("default rate is audio", () => {
    const src = createNode("In", "audio", [ 0 ]);
    const node = In(0, 2);

    assert(Array.isArray(node) && node.length === 2);
    assert.deepEqual(node[0], {
      type: "OutputProxy", rate: "audio", props: [ src, 0, 2 ]
    });
    assert.deepEqual(node[1], {
      type: "OutputProxy", rate: "audio", props: [ src, 1, 2 ]
    });
    assert(node[0].props[0] === node[1].props[0]);
  });

  it("not array when single channels", () => {
    const src = createNode("In", "audio", [ 0 ]);
    const node = In.ar(0, 1);

    assert(!Array.isArray(node));
    assert.deepEqual(node, {
      type: "OutputProxy", rate: "audio", props: [ src, 0, 1 ]
    });
  });
});
