import assert from "assert";
import BufWr from "../../../src/scapi/units/BufWr";
import createNode from "../../../src/scapi/utils/createNode";

describe("scapi/units/BufWr", () => {
  it(".ar should create audio rate node", () => {
    const inputs = [
      createNode("SinOsc", "audio", [ 440, 0 ]),
      createNode("SinOsc", "audio", [ 442, 0 ]),
    ];
    const a = createNode("Phasor", "audio", [ 0, 1, 0, 1, 0 ]);
    const node = BufWr.ar(inputs, 1, a, 0);

    assert.deepEqual(node, {
      type: "BufWr", rate: "audio", props: [ 1, a, 0 ].concat(inputs)
    });
  });

  it(".kr should create control rate node", () => {
    const inputs = [
      createNode("SinOsc", "audio", [ 440, 0 ]),
      createNode("SinOsc", "audio", [ 442, 0 ]),
    ];
    const a = createNode("Phasor", "control", [ 0, 1, 0, 1, 0 ]);
    const node = BufWr.kr(inputs, 1, a, 0);

    assert.deepEqual(node, {
      type: "BufWr", rate: "control", props: [ 1, a, 0 ].concat(inputs)
    });
  });

  it("default rate is the same as the seconds input", () => {
    const inputs = [
      createNode("SinOsc", "audio", [ 440, 0 ]),
      createNode("SinOsc", "audio", [ 442, 0 ]),
    ];
    const a = createNode("Phasor", "audio", [ 0, 1, 0, 1, 0 ]);
    const node = BufWr(inputs, 1, a, 0);

    assert.deepEqual(node, {
      type: "BufWr", rate: "audio", props: [ 1, a, 0 ].concat(inputs)
    });
  });

  it("should throw Error when node is audio rate but inputs[1] is not", () => {
    const inputs = [
      createNode("SinOsc", "audio", [ 440, 0 ]),
      createNode("SinOsc", "audio", [ 442, 0 ]),
    ];
    const a = createNode("Phasor", "control", [ 0, 1, 0, 1, 0 ]);

    assert.throws(() => {
      BufWr.ar(inputs, 1, a, 0);
    }, TypeError);
  });
});
