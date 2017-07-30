import assert from "assert";
import BufRd from "../../../src/scapi/units/BufRd";
import createNode from "../../../src/scapi/utils/createNode";

describe("scapi/units/BufRd", () => {
  it(".ar should create audio multi out node", () => {
    const a = createNode("Phasor", "audio", [ 0, 1, 0, 1, 0 ]);
    const src = createNode("BufRd", "audio", [ 1, a, 0, 2 ]);
    const node = BufRd.ar(2, 1, a, 0, 2);

    assert(Array.isArray(node) && node.length === 2);
    assert.deepEqual(node[0], {
      type: "OutputProxy", rate: "audio", props: [ src, 0, 2 ]
    });
    assert.deepEqual(node[1], {
      type: "OutputProxy", rate: "audio", props: [ src, 1, 2 ]
    });
    assert(node[0].props[0] === node[1].props[0]);
  });

  it(".kr should create audio multi out node", () => {
    const a = createNode("Phasor", "control", [ 0, 1, 0, 1, 0 ]);
    const src = createNode("BufRd", "control", [ 1, a, 0, 2 ]);
    const node = BufRd.kr(2, 1, a, 0, 2);

    assert(Array.isArray(node) && node.length === 2);
    assert.deepEqual(node[0], {
      type: "OutputProxy", rate: "control", props: [ src, 0, 2 ]
    });
    assert.deepEqual(node[1], {
      type: "OutputProxy", rate: "control", props: [ src, 1, 2 ]
    });
    assert(node[0].props[0] === node[1].props[0]);
  });

  it("default rate is the same as the third input", () => {
    const a = createNode("Phasor", "audio", [ 0, 1, 0, 1, 0 ]);
    const src = createNode("BufRd", "audio", [ 1, a, 0, 2 ]);
    const node = BufRd(2, 1, a, 0, 2);

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
    const a = createNode("Phasor", "audio", [ 0, 1, 0, 1, 0 ]);
    const src = createNode("BufRd", "audio", [ 1, a, 0, 2 ]);
    const node = BufRd.ar(1, 1, a, 0, 2);

    assert(!Array.isArray(node));
    assert.deepEqual(node, {
      type: "OutputProxy", rate: "audio", props: [ src, 0, 1 ]
    });
  });

  it("should throw Error when node is audio rate but inputs[1] is not", () => {
    const a = createNode("Phasor", "control", [ 0, 1, 0, 1, 0 ]);

    assert.throws(() => {
      BufRd.ar(2, 1, a, 0, 2);
    }, TypeError);
  });
});
