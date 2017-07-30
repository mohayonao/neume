import assert from "assert";
import Klank from "../../../src/scapi/units/Klank";
import createNode from "../../../src/scapi/utils/createNode";
import createRef from "../../../src/scapi/utils/createRef";

describe("scapi/units/Klank", () => {
  it(".ar should create audio rate node", () => {
    const ref = createRef([ [ 800, 1071, 1153, 1723 ], [ 1, 0.8 ], [ 1, 1, 0.5, 0.3 ] ]);
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = Klank.ar(ref, a, 1.5, 100, 2);

    assert.deepEqual(node, {
      type: "Klank", rate: "audio", props: [ a, 1.5, 100, 2, 800, 1, 1, 1071, 0.8, 1, 1153, 1, 0.5, 1723, 0.8, 0.3 ]
    });
  });

  it("default rate is audio", () => {
    const ref = createRef([ 100 ]);
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = Klank(ref, a);

    assert.deepEqual(node, {
      type: "Klank", rate: "audio", props: [ a, 1, 0, 1, 100, 1, 1 ]
    });
  });
});
