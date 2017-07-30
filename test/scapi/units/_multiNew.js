import assert from "assert";
import sinon from "sinon";
import isSCNode from "../../../src/scapi/utils/isSCNode";
import multiNew from "../../../src/scapi/units/_multiNew";

describe("scapi/units/_multiNew(type, rate, [props, create])", () => {
  it("should return a sc.node", () => {
    const node = multiNew("SinOsc", "audio", [ 440, 0 ]);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "SinOsc", rate: "audio", props: [ 440, 0 ]
    });
  });

  it("should return a sc.node (props not given)", () => {
    const node = multiNew("WhiteNoise", "audio");

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "WhiteNoise", rate: "audio", props: []
    });
  });

  it("should return same shape array when given array props", () => {
    const node = multiNew("SinOsc", "audio", [ [ 440, 442 ], 0 ]);

    assert(Array.isArray(node) && node.length === 2);
    assert(isSCNode(node[0]));
    assert(isSCNode(node[1]));
    assert.deepEqual(node[0], {
      type: "SinOsc", rate: "audio", props: [ 440, 0 ]
    });
    assert.deepEqual(node[1], {
      type: "SinOsc", rate: "audio", props: [ 442, 0 ]
    });
  });

  it("should call create() when given it", () => {
    const create = sinon.spy();
    const node = multiNew("SinOsc", "audio", [ [ 440, 442 ], 0 ], create);

    assert(Array.isArray(node) && node.length === 2);
    assert(create.callCount === 2);
    assert.deepEqual(create.args[0], [ "SinOsc", "audio", [ 440, 0 ] ]);
    assert.deepEqual(create.args[1], [ "SinOsc", "audio", [ 442, 0 ] ]);
  });
});
