import assert from "assert";
import note from "../../../src/neume/music/note";

describe("neume/music/note(n)", () => {
  it("should do nothing when n is number", () => {
    assert(note(69) === 69);
    assert(note(null) === null);
  });

  it("should convert midi number from note name when n is string", () => {
    assert(note("c") === 0);
    assert(note("d") === 2);
    assert(note("e") === 4);
    assert(note("f") === 5);
    assert(note("g") === 7);
    assert(note("a") === 9);
    assert(note("b") === 11);
    assert(note("c4") === 60);
    assert(note("c#4") === 61);
    assert(note("eb2") === 39);
    assert(note("F+7") === 102);
    assert(note("D-5") === 73);
    assert(note(null) === null);
  });

  it("chord", () => {
    assert.deepEqual(note("c4(major)"), [ 60, 64, 67 ]);
    assert.deepEqual(note("c4", "major"), [ 60, 64, 67 ]);
    assert.deepEqual(note(60, "major"), [ 60, 64, 67 ]);
    assert.deepEqual(note("major"), [ 0, 4, 7 ]);
  });

  it("chord with inversion", () => {
    assert.deepEqual(note("c4(major)", 0), [ 60, 64, 67 ]);
    assert.deepEqual(note("c4(major)", 1), [ 64, 67, 72 ]);
    assert.deepEqual(note("c4", "major", -1), [ 55, 60, 64 ]);
    assert.deepEqual(note(60, "major", 2), [ 67, 72, 76 ]);
    assert.deepEqual(note("major", -2), [ -8, -5, 0 ]);
  });

  it("array.map", () => {
    const noteNumbers = [ "c4", "c#4", "c4(major)" ].map(note);

    assert.deepEqual(noteNumbers, [ 60, 61, [ 60, 64, 67] ]);
  });

  it("error case", () => {
    assert.throws(() => {
      note();
    });
    assert.throws(() => {
      note({ value: 60 });
    });
    assert.throws(() => {
      note("mi");
    });
  });
});
