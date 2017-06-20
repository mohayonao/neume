import assert from "assert";
import add from "../../../src/scapi/operators/add";
import ref from "../../../src/scapi/api/ref";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";
import isSCRef from "../../../src/scapi/utils/isSCRef";

describe("scapi/operators/add(a, b)", () => {
  it("numeric", () => {
    const a = 10;
    const b = 20;
    const node = add(a, b);

    assert(node === (a + b));
  });

  it("string", () => {
    const a = "abc";
    const b = "xyz";
    const node = add(a, b);

    assert(node === (a + b));
  });

  it("null", () => {
    const a = 10;
    const b = null;
    const node = add(a, b);

    assert(node === null);
  });

  it("array", () => {
    const a = [ 10, 100 ];
    const b = 20;
    const node = add(a, b);

    assert.deepEqual(node, [ a[0] + b, a[1] + b ]);
  });

  it("sc.ref", () => {
    const a = ref(10);
    const b = ref(20);
    const node = add(a, b);

    assert(isSCRef(node));
    assert(node.valueOf() === (10 + 20));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = 20;
    const node = add(a, b);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "+", rate: "audio", props: [ a, b ]
    });
  });

  it("is an unbinded function", () => {
    const a = 10;
    const b = 20;
    const node = add.call(a, b);

    assert(node === (a + b));
  });
});
