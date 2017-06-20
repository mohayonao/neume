import assert from "assert";
import Pan2 from "../../../src/scapi/units/Pan2";
import createNode from "../../../src/scapi/utils/createNode";

describe("scapi/units/Pan2", () => {
  it(".ar should create audio multi out node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = createNode("SinOsc", "control", [ 1, 0 ]);
    const pan2 = createNode("Pan2", "audio", [ a, b, 1 ]);
    const node = Pan2.ar(a, b);

    assert(Array.isArray(node) && node.length === 2);
    assert.deepEqual(node[0], {
      type: "OutputProxy", rate: "audio", props: [ pan2, 0, 2 ]
    });
    assert.deepEqual(node[1], {
      type: "OutputProxy", rate: "audio", props: [ pan2, 1, 2 ]
    });
    assert(node[0].props[0] === node[1].props[0]);
  });

  it(".kr should create control multi out node", () => {
    const a = createNode("SinOsc", "control", [ 440, 0 ]);
    const b = createNode("SinOsc", "control", [ 1, 0 ]);
    const pan2 = createNode("Pan2", "control", [ a, b, 1 ]);
    const node = Pan2.kr(a, b);

    assert(Array.isArray(node) && node.length === 2);
    assert.deepEqual(node[0], {
      type: "OutputProxy", rate: "control", props: [ pan2, 0, 2 ]
    });
    assert.deepEqual(node[1], {
      type: "OutputProxy", rate: "control", props: [ pan2, 1, 2 ]
    });
    assert(node[0].props[0] === node[1].props[0]);
  });

  it("default rate is the same as the first input", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = createNode("SinOsc", "control", [ 1, 0 ]);
    const pan2 = createNode("Pan2", "audio", [ a, b, 1 ]);
    const node = Pan2(a, b);

    assert(Array.isArray(node) && node.length === 2);
    assert.deepEqual(node[0], {
      type: "OutputProxy", rate: "audio", props: [ pan2, 0, 2 ]
    });
    assert.deepEqual(node[1], {
      type: "OutputProxy", rate: "audio", props: [ pan2, 1, 2 ]
    });
    assert(node[0].props[0] === node[1].props[0]);
  });

  it("should throw Error when the node is audio rate but the input is not", () => {
    const a = createNode("SinOsc", "control", [ 440, 0 ]);
    const b = createNode("SinOsc", "control", [ 1, 0 ]);

    assert.throws(() => {
      Pan2.ar(a, b);
    }, TypeError);
  });
});
