import assert from "assert";
import PlayBuf from "../../../src/scapi/units/PlayBuf";
import createNode from "../../../src/scapi/utils/createNode";

describe("scapi/units/PlayBuf", () => {
  it(".ar should create audio multi out node", () => {
    const playBuf = createNode("PlayBuf", "audio", [ 0, 1, 1, 0, 0, 2 ]);
    const node = PlayBuf.ar(2, 0, 1, 1, 0, 0, 2);

    assert(Array.isArray(node) && node.length === 2);
    assert.deepEqual(node[0], {
      type: "OutputProxy", rate: "audio", props: [ playBuf, 0, 2 ]
    });
    assert.deepEqual(node[1], {
      type: "OutputProxy", rate: "audio", props: [ playBuf, 1, 2 ]
    });
    assert(node[0].props[0] === node[1].props[0]);
  });

  it(".kr should create control multi out node", () => {
    const playBuf = createNode("PlayBuf", "control", [ 0, 1, 1, 0, 0, 2 ]);
    const node = PlayBuf.kr(1, 0, 1, 1, 0, 0, 2);

    assert.deepEqual(node, {
      type: "OutputProxy", rate: "control", props: [ playBuf, 0, 1 ]
    });
  });

  it("default rate is audio", () => {
    const playBuf = createNode("PlayBuf", "audio", [ 0, 1, 1, 0, 0, 2 ]);
    const node = PlayBuf(2, 0, 1, 1, 0, 0, 2);

    assert(Array.isArray(node) && node.length === 2);
    assert.deepEqual(node[0], {
      type: "OutputProxy", rate: "audio", props: [ playBuf, 0, 2 ]
    });
    assert.deepEqual(node[1], {
      type: "OutputProxy", rate: "audio", props: [ playBuf, 1, 2 ]
    });
    assert(node[0].props[0] === node[1].props[0]);
  });
});
