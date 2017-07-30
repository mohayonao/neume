import assert from "assert";
import mul from "../../../src/scapi/operators/mul";
import ref from "../../../src/scapi/api/ref";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";
import isSCRef from "../../../src/scapi/utils/isSCRef";

describe("scapi/operators/mul(a, b)", () => {
  it("numeric", () => {
    const a = 10;
    const b = 20;
    const node = mul(a, b);

    assert(node === (a * b));
  });

  it("null", () => {
    const a = 10;
    const b = null;
    const node = mul(a, b);

    assert(node === null);
  });

  it("array", () => {
    const a = [ 10, 100 ];
    const b = 20;
    const node = mul(a, b);

    assert.deepEqual(node, [ a[0] * b, a[1] * b ]);
  });

  it("sc.ref", () => {
    const a = ref(10);
    const b = ref(20);
    const node = mul(a, b);

    assert(isSCRef(node));
    assert(node.valueOf() === (10 * 20));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = 20;
    const node = mul(a, b);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "*", rate: "audio", props: [ a, b ]
    });
  });

  it("is an unbinded function", () => {
    const a = 10;
    const b = 20;
    const node = mul.call(a, b);

    assert(node === (a * b));
  });
});
