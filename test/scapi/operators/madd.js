import assert from "assert";
import madd from "../../../src/scapi/operators/madd";
import ref from "../../../src/scapi/api/ref";
import createNode from "../../../src/scapi/utils/createNode";
import isSCNode from "../../../src/scapi/utils/isSCNode";
import isSCRef from "../../../src/scapi/utils/isSCRef";

describe("scapi/operators/madd(a, b, c)", () => {
  it("numeric", () => {
    const a = 10;
    const b = 20;
    const c = 30;
    const node = madd(a, b, c);

    assert(node === (a * b + c));
  });

  it("null", () => {
    const a = 10;
    const b = 20;
    const c = null;
    const node = madd(a, b, c);

    assert(node === null);
  });

  it("array", () => {
    const a = [ 10, 100 ];
    const b = 20;
    const c = 30;
    const node = madd(a, b, c);

    assert.deepEqual(node, [ a[0] * b + c, a[1] * b + c]);
  });

  it("sc.ref", () => {
    const a = ref(10);
    const b = ref(20);
    const c = ref(30);
    const node = madd(a, b, c);

    assert(isSCRef(c));
    assert(node.valueOf() === (10 * 20 + 30));
  });

  it("sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = 20;
    const c = 30;
    const node = madd(a, b, c);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "MulAdd", rate: "audio", props: [ a, b, c ]
    });
  });

  it("is an unbinded function", () => {
    const a = 10;
    const b = 20;
    const c = 30;
    const node = madd.call(a, b, c);

    assert(node === (a * b + c));
  });
});
