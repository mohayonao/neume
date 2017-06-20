import assert from "assert";
import Out from "../../../src/scapi/units/Out";
import createNode from "../../../src/scapi/utils/createNode";
import isSCOutputNode from "../../../src/scapi/utils/isSCOutputNode";

describe("scapi/units/Out", () => {
  it(".ar should create audid output node", () => {
    const inputs = [
      createNode("SinOsc", "audio", [ 440, 0 ]),
      createNode("SinOsc", "audio", [ 442, 0 ]),
    ];
    const node = Out.ar(0, inputs);

    assert(isSCOutputNode(node));
    assert.deepEqual(node.props[0], {
      type: "Out", rate: "audio", props: [ 0 ].concat(inputs)
    });
  });

  it(".kr should create audid output node", () => {
    const inputs = [
      createNode("SinOsc", "control", [ 2, 0 ]),
      createNode("SinOsc", "control", [ 7, 0 ]),
    ];
    const node = Out.kr(0, inputs);

    assert(isSCOutputNode(node));
    assert.deepEqual(node.props[0], {
      type: "Out", rate: "control", props: [ 0 ].concat(inputs)
    });
  });

  it("should the inputs are flattened", () => {
    const inputs = [
      createNode("SinOsc", "audio", [ 440, 0 ]),
      createNode("SinOsc", "audio", [ 442, 0 ]),
    ];
    const node = Out.ar(0, inputs.map(node => [ [ node ] ]));

    assert(isSCOutputNode(node));
    assert.deepEqual(node.props[0], {
      type: "Out", rate: "audio", props: [ 0 ].concat(inputs)
    });
  });

  it("should throw Error when ths node is audio rate but the input is not", () => {
    const inputs = [
      createNode("SinOsc", "audio", [ 440, 0 ]),
      createNode("SinOsc", "control", [ 2, 0 ]),
    ];

    assert.throws(() => {
      Out.ar(0, inputs);
    }, TypeError);
  });
});
