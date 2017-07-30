import assert from "assert";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";
import mix from "../../../src/scapi/api/mix";

describe("scapi/api/mix(items)", () => {
  it("should create a mixed sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = createNode("SinOsc", "audio", [ 442, 0 ]);
    const c = createNode("SinOsc", "audio", [ 444, 0 ]);
    const node = mix([ a, b, c ]);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "Sum3", rate: "audio", props: [ a, b, c ]
    });
  });

  it("should create a mixed sc.node[] when given array", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = createNode("SinOsc", "audio", [ 442, 0 ]);
    const c = createNode("SinOsc", "audio", [ 444, 0 ]);
    const d = createNode("SinOsc", "audio", [ 446, 0 ]);
    const node = mix([ a, b, [ c, d ] ]);

    assert(Array.isArray(node) && node.length === 2);
    assert(isSCNode(node[0]));
    assert.deepEqual(node[0], {
      type: "Sum3", rate: "audio", props: [ a, b, c ]
    });
    assert(isSCNode(node[1]));
    assert.deepEqual(node[1], {
      type: "Sum3", rate: "audio", props: [ a, b, d ]
    });
  });

  it("is an unbinded function", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = createNode("SinOsc", "audio", [ 442, 0 ]);
    const c = createNode("SinOsc", "audio", [ 444, 0 ]);
    const node = mix.call([ a, b, c ]);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "Sum3", rate: "audio", props: [ a, b, c ]
    });
  });
});
