import assert from "assert";
import parseFnArgs from "../../../src/neume/utils/parseFnArgs";

describe("neume/utils/parseFnArgs(fn)", () => {
  it("should parse args", () => {
    function fn(a, b, c) {
      return [ a, b, c ];
    }

    const args = parseFnArgs(fn);

    assert.deepEqual(args, [ "a", "b", "c" ]);
  });

  it("should parse args with default value", () => {
    function fn(a = 10, b = [ 20, 30 ], c = '40') {
      return [ a, b, c ];
    }

    const args = parseFnArgs(fn);

    assert.deepEqual(args, [ "a = 10", "b = [20, 30]", "c = '40'" ]);
  });

  it("should parse args from arrow function", () => {
    const fn = a => a;

    const args = parseFnArgs(fn);

    assert.deepEqual(args, [ "a" ]);
  });

  it("should parse args with default string value", () => {
    function fn(a = 10, b = [ 20, 30 ], c = '\'40') {
      return [ a, b, c ];
    }

    const args = parseFnArgs(fn);

    assert.deepEqual(args, [ "a = 10", "b = [20, 30]", "c = '\\'40'" ]);
  });

  it("should parse none args", () => {
    function fn(  ) {
      return [];
    }

    const args = parseFnArgs(fn);

    assert.deepEqual(args, []);
  });
});
