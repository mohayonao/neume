import assert from "assert";
import arp, { arpIndex } from "../../../src/neume/music/arp";

describe("neume/music/arp(list, style, length, distance)", () => {
  it("should make arp pattern", () => {
    const chord = [ 60, 62, 64, 65 ];
    const pattern = arp(chord, "pinky up");

    assert.deepEqual(pattern, [ 60, 65, 62, 65, 64, 65 ]);
  });

  it("should make arp pattern with chord name", () => {
    const chord = "C4(m7)";
    const pattern = arp(chord, "pinky up");

    assert.deepEqual(pattern, [ 60, 70, 63, 70, 67, 70 ]);
  });

  it("should make arp pattern with length", () => {
    const chord = [ 60, 62, 64, 65 ];
    const pattern = arp(chord, "pinky up", 8);

    assert.deepEqual(pattern, [ 60, 65, 62, 65, 64, 65, 60, 65 ]);
  });

  it("should make arp pattern with length & distance", () => {
    const chord = [ 60, 62, 64, 65 ];
    const pattern = arp(chord, "pinky up", 8, 12);

    assert.deepEqual(pattern, [ 60, 65, 62, 65, 64, 65, 72, 77 ]);
  });
});

describe("neume/music/arp/arpIndex(style, length)", () => {
  it("up", () => {
    const indices = arpIndex("up", 5);

    // □ □ □ □ ■
    // □ □ □ ■ □
    // □ □ ■ □ □
    // □ ■ □ □ □
    // ■ □ □ □ □
    assert.deepEqual(indices, [ 0, 1, 2, 3, 4 ]);
  });

  it("down", () => {
    const indices = arpIndex("down", 5);

    // ■ □ □ □ □
    // □ ■ □ □ □
    // □ □ ■ □ □
    // □ □ □ ■ □
    // □ □ □ □ ■
    assert.deepEqual(indices, [ 4, 3, 2, 1, 0 ]);
  });

  it("updown", () => {
    const indices = arpIndex("updown", 5);

    // □ □ □ □ ■ □ □ □
    // □ □ □ ■ □ ■ □ □
    // □ □ ■ □ □ □ ■ □
    // □ ■ □ □ □ □ □ ■
    // ■ □ □ □ □ □ □ □
    assert.deepEqual(indices, [ 0, 1, 2, 3, 4, 3, 2, 1 ]);
  });

  it("downup", () => {
    const indices = arpIndex("downup", 5);

    // ■ □ □ □ □ □ □ □
    // □ ■ □ □ □ □ □ ■
    // □ □ ■ □ □ □ ■ □
    // □ □ □ ■ □ ■ □ □
    // □ □ □ □ ■ □ □ □
    assert.deepEqual(indices, [ 4, 3, 2, 1, 0, 1, 2, 3 ]);
  });

  it("up&down", () => {
    const indices = arpIndex("up&down", 5);

    // □ □ □ □ ■ ■ □ □ □ □
    // □ □ □ ■ □ □ ■ □ □ □
    // □ □ ■ □ □ □ □ ■ □ □
    // □ ■ □ □ □ □ □ □ ■ □
    // ■ □ □ □ □ □ □ □ □ ■
    assert.deepEqual(indices, [ 0, 1, 2, 3, 4, 4, 3, 2, 1, 0 ]);
  });

  it("down&up", () => {
    const indices = arpIndex("down&up", 5);

    // ■ □ □ □ □ □ □ □ □ ■
    // □ ■ □ □ □ □ □ □ ■ □
    // □ □ ■ □ □ □ □ ■ □ □
    // □ □ □ ■ □ □ ■ □ □ □
    // □ □ □ □ ■ ■ □ □ □ □
    assert.deepEqual(indices, [ 4, 3, 2, 1, 0, 0, 1, 2, 3, 4 ]);
  });

  it("converge", () => {
    const indices = arpIndex("converge", 5);

    // □ ■ □ □ □
    // □ □ □ ■ □
    // □ □ □ □ ■
    // □ □ ■ □ □
    // ■ □ □ □ □
    assert.deepEqual(indices, [ 0, 4, 1, 3, 2 ]);
  });

  it("diverge", () => {
    const indices = arpIndex("diverge", 5);

    // □ □ □ ■ □
    // □ ■ □ □ □
    // ■ □ □ □ □
    // □ □ ■ □ □
    // □ □ □ □ ■
    assert.deepEqual(indices, [ 2, 3, 1, 4, 0 ]);
  });

  it("con&diverge", () => {
    const indices = arpIndex("con&diverge", 5);

    // □ ■ □ □ □ □ □ ■
    // □ □ □ ■ □ ■ □ □
    // □ □ □ □ ■ □ □ □
    // □ □ ■ □ □ □ ■ □
    // ■ □ □ □ □ □ □ □
    assert.deepEqual(indices, [ 0, 4, 1, 3, 2, 3, 1, 4 ]);
  });

  it("pinky up", () => {
    const indices = arpIndex("pinky up", 5);

    // □ ■ □ ■ □ ■ □ ■
    // □ □ □ □ □ □ ■ □
    // □ □ □ □ ■ □ □ □
    // □ □ ■ □ □ □ □ □
    // ■ □ □ □ □ □ □ □
    assert.deepEqual(indices, [ 0, 4, 1, 4, 2, 4, 3, 4 ]);
  });

  it("pinky updown", () => {
    const indices = arpIndex("pinky updown", 5);

    // □ ■ □ ■ □ ■ □ ■ □ ■ □ ■
    // □ □ □ □ □ □ ■ □ □ □ □ □
    // □ □ □ □ ■ □ □ □ ■ □ □ □
    // □ □ ■ □ □ □ □ □ □ □ ■ □
    // ■ □ □ □ □ □ □ □ □ □ □ □
    assert.deepEqual(indices, [ 0, 4, 1, 4, 2, 4, 3, 4, 2, 4, 1, 4 ]);
  });

  it("thumb up", () => {
    const indices = arpIndex("thumb up", 5);

    // □ □ □ □ □ □ □ ■
    // □ □ □ □ □ ■ □ □
    // □ □ □ ■ □ □ □ □
    // □ ■ □ □ □ □ □ □
    // ■ □ ■ □ ■ □ ■ □
    assert.deepEqual(indices, [ 0, 1, 0, 2, 0, 3, 0, 4 ]);
  });

  it("thumb updown", () => {
    const indices = arpIndex("thumb updown", 5);

    // □ □ □ □ □ □ □ ■ □ □ □ □
    // □ □ □ □ □ ■ □ □ □ ■ □ □
    // □ □ □ ■ □ □ □ □ □ □ □ ■
    // □ ■ □ □ □ □ □ □ □ □ □ □
    // ■ □ ■ □ ■ □ ■ □ ■ □ ■ □
    assert.deepEqual(indices, [ 0, 1, 0, 2, 0, 3, 0, 4, 0, 3, 0, 2 ]);
  });

  it("should throw Error when else case", () => {
    assert.throws(() => {
      arpIndex("unknown style", 5);
    }, TypeError);
  });
});
