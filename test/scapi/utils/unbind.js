import assert from "assert";
import unbind from "../../../src/scapi/utils/unbind";
import createNode from "../../../src/scapi/utils/createNode";
import createRef from "../../../src/scapi/utils/createRef";

describe("scapi/utils/unbind(fn)", () => {
  const toList = unbind((a, b) => [ a, b ]);

  it("use this when this is primitive (exclude undefined)", () => {
    assert.deepEqual(toList(2, 3), [ 2, 3 ]);
    assert.deepEqual(toList("2", 3), [ "2", 3 ]);
    assert.deepEqual(toList(null, 3), [ null, 3 ]);
  });

  it("use this when this is Array", () => {
    assert.deepEqual(toList([ 2 ], 3), [ [ 2 ], 3 ]);
  });

  it("use this when this is SCNode", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);

    assert.deepEqual(toList(a, 3), [ a, 3 ]);
  });

  it("use this when this is SCRef", () => {
    const a = createRef(10);

    assert.deepEqual(toList(a, 3), [ a, 3 ]);
  });

  it("else case, not use this", () => {
    const api = { toList };

    assert.deepEqual(toList.call({}, 2, 3), [ 2, 3 ]);
    assert.deepEqual(api.toList(2, 3), [ 2, 3 ]);
  });
});
