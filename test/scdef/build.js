import assert from "assert";

import scapi from "../../src/scapi";
import build from "../../src/scdef/build";

const { ctl, add, mul, Out, SinOsc, Pan2, WhiteNoise } = scapi;

describe("scdef/build(name, node)", () => {
  it("basic nodes", () => {
    const node = Out.ar(0, SinOsc.ar(440, SinOsc.kr(0.5)));
    const sdef = build("temp", [ node ]);

    assert.deepEqual(sdef, {
      name: "temp",
      consts: [ 0, 440, 0.5 ],
      units: [
        [ "SinOsc", 1, 0, [ [ -1, 2 ], [ -1, 0 ] ], [ 1 ] ],
        [ "SinOsc", 2, 0, [ [ -1, 1 ], [  0, 0 ] ], [ 2 ] ],
        [ "Out"   , 2, 0, [ [ -1, 0 ], [  1, 0 ] ], [   ] ],
      ]
    });
  });

  it("random nodes", () => {
    const node = Out.ar(0, [ WhiteNoise.ar(), WhiteNoise.ar() ]);
    const sdef = build("temp", [ node ]);

    assert.deepEqual(sdef, {
      name: "temp",
      consts: [ 0 ],
      units: [
        [ "WhiteNoise", 2, 0, [                                ], [ 2 ] ],
        [ "WhiteNoise", 2, 0, [                                ], [ 2 ] ],
        [ "Out"       , 2, 0, [ [ -1, 0 ], [  0, 0 ], [ 1, 0 ] ], [   ] ],
      ]
    });
  });

  it("Control", () => {
    const node = Out.ar(0, SinOsc.ar(ctl("freq", 440)));
    const sdef = build("temp", [ node ]);

    assert.deepEqual(sdef, {
      name: "temp",
      consts: [ 0 ],
      paramValues: [ 440 ],
      paramIndices: [
        { name: "freq", index: 0, length: 1 }
      ],
      units: [
        [ "Control", 1, 0, [                      ], [ 1 ] ],
        [ "SinOsc" , 2, 0, [ [  0, 0 ], [ -1, 0 ] ], [ 2 ] ],
        [ "Out"    , 2, 0, [ [ -1, 0 ], [  1, 0 ] ], [   ] ],
      ]
    });
  });

  it("AudioControl", () => {
    const node = Out.ar(0, SinOsc.ar(ctl.ar("freq", 440)));
    const sdef = build("temp", [ node ]);

    assert.deepEqual(sdef, {
      name: "temp",
      consts: [ 0 ],
      paramValues: [ 440 ],
      paramIndices: [
        { name: "freq", index: 0, length: 1 }
      ],
      units: [
        [ "AudioControl", 2, 0, [                      ], [ 2 ] ],
        [ "SinOsc"      , 2, 0, [ [  0, 0 ], [ -1, 0 ] ], [ 2 ] ],
        [ "Out"         , 2, 0, [ [ -1, 0 ], [  1, 0 ] ], [   ] ],
      ]
    });
  });

  it("ScalarControl", () => {
    const node = Out.ar(ctl.ir("out"), SinOsc.ar(ctl.kr("freq", 440)));
    const sdef = build("temp", [ node ]);

    assert.deepEqual(sdef, {
      name: "temp",
      consts: [ 0 ],
      paramValues: [ 0, 440 ],
      paramIndices: [
        { name: "out", index: 0, length: 1 },
        { name: "freq", index: 1, length: 1 },
      ],
      units: [
        [ "Control", 0, 0, [                     ], [ 0 ] ],
        [ "Control", 1, 1, [                     ], [ 1 ] ],
        [ "SinOsc" , 2, 0, [ [ 1, 0 ], [ -1, 0 ] ], [ 2 ] ],
        [ "Out"    , 2, 0, [ [ 0, 0 ], [  2, 0 ] ], [   ] ],
      ]
    });
  });

  it("many Controls", () => {
    const node = Out.ar(0, [
      SinOsc.ar(ctl.ar("freq1", 220), ctl.tr("trig1")),
      SinOsc.ar(ctl.kr("freq2", 440), ctl.tr("trig2")),
      SinOsc.ar(ctl.ar("freq3", 660), ctl.tr("trig3")),
      SinOsc.ar(ctl.kr("freq4", 880), ctl.tr("trig4")),
    ]);

    const sdef = build("temp", [ node ]);

    assert.deepEqual(sdef, {
      name: "temp",
      consts: [  0 ],
      paramValues: [ 220, 660, 0, 0, 0, 0, 440, 880 ],
      paramIndices: [
        { name: "freq1", index: 0, length: 1 },
        { name: "freq3", index: 1, length: 1 },
        { name: "trig1", index: 2, length: 1 },
        { name: "trig2", index: 3, length: 1 },
        { name: "trig3", index: 4, length: 1 },
        { name: "trig4", index: 5, length: 1 },
        { name: "freq2", index: 6, length: 1 },
        { name: "freq4", index: 7, length: 1 },
      ],
      units: [
        [ "AudioControl", 2, 0, [                                                   ], [ 2, 2       ] ],
        [ "TrigControl" , 1, 2, [                                                   ], [ 1, 1, 1, 1 ] ],
        [ "SinOsc"      , 2, 0, [ [  0, 0 ], [ 1, 0 ]                               ], [ 2          ] ],
        [ "Control"     , 1, 6, [                                                   ], [ 1, 1       ] ],
        [ "SinOsc"      , 2, 0, [ [  3, 0 ], [ 1, 1 ]                               ], [ 2          ] ],
        [ "SinOsc"      , 2, 0, [ [  0, 1 ], [ 1, 2 ]                               ], [ 2          ] ],
        [ "SinOsc"      , 2, 0, [ [  3, 1 ], [ 1, 3 ]                               ], [ 2          ] ],
        [ "Out"         , 2, 0, [ [ -1, 0 ], [ 2, 0 ], [ 4, 0 ], [ 5, 0 ], [ 6, 0 ] ], [            ] ]
      ]
    });
  });

  it("many Controls with sorting", () => {
    const node = Out.ar(0, [
      SinOsc.ar(ctl.ar("freq1", 220), ctl.tr("trig1")),
      SinOsc.ar(ctl.kr("freq2", 440), ctl.tr("trig2")),
      SinOsc.ar(ctl.ar("freq3", 660), ctl.tr("trig3")),
      SinOsc.ar(ctl.kr("freq4", 880), ctl.tr("trig4")),
    ]);

    const sdef = build("temp", [ node ], [
      "freq1", "freq2", "freq3", "freq4"
    ]);

    assert.deepEqual(sdef, {
      name: "temp",
      consts: [  0 ],
      paramValues: [ 220, 660, 0, 0, 0, 0, 440, 880 ],
      paramIndices: [
        { name: "freq1", index: 0, length: 1 },
        { name: "freq2", index: 6, length: 1 },
        { name: "freq3", index: 1, length: 1 },
        { name: "freq4", index: 7, length: 1 },
        { name: "trig1", index: 2, length: 1 },
        { name: "trig2", index: 3, length: 1 },
        { name: "trig3", index: 4, length: 1 },
        { name: "trig4", index: 5, length: 1 },
      ],
      units: [
        [ "AudioControl", 2, 0, [                                                   ], [ 2, 2       ] ],
        [ "TrigControl" , 1, 2, [                                                   ], [ 1, 1, 1, 1 ] ],
        [ "SinOsc"      , 2, 0, [ [  0, 0 ], [ 1, 0 ]                               ], [ 2          ] ],
        [ "Control"     , 1, 6, [                                                   ], [ 1, 1       ] ],
        [ "SinOsc"      , 2, 0, [ [  3, 0 ], [ 1, 1 ]                               ], [ 2          ] ],
        [ "SinOsc"      , 2, 0, [ [  0, 1 ], [ 1, 2 ]                               ], [ 2          ] ],
        [ "SinOsc"      , 2, 0, [ [  3, 1 ], [ 1, 3 ]                               ], [ 2          ] ],
        [ "Out"         , 2, 0, [ [ -1, 0 ], [ 2, 0 ], [ 4, 0 ], [ 5, 0 ], [ 6, 0 ] ], [            ] ]
      ]
    });
  });

  it("OutputProxy", () => {
    const node = Out.ar(0, Pan2.ar(SinOsc.ar(), SinOsc.kr(1)))
    const sdef = build("temp", [ node ]);

    assert.deepEqual(sdef, {
      name: "temp",
      consts: [ 0, 440, 1 ],
      units: [
        [ "SinOsc", 2, 0, [ [ -1, 1 ], [ -1, 0 ]            ], [ 2    ] ],
        [ "SinOsc", 1, 0, [ [ -1, 2 ], [ -1, 0 ]            ], [ 1    ] ],
        [ "Pan2"  , 2, 0, [ [  0, 0 ], [  1, 0 ], [ -1, 2 ] ], [ 2, 2 ] ],
        [ "Out"   , 2, 0, [ [ -1, 0 ], [  2, 0 ], [  2, 1 ] ], [      ] ],
      ]
    });
  });

  it("BinaryOpUGen", () => {
    const node = Out.ar(0, mul(WhiteNoise.ar(), WhiteNoise.ar()));
    const sdef = build("temp", [ node ]);

    assert.deepEqual(sdef, {
      name: "temp",
      consts: [ 0 ],
      units: [
        [ "WhiteNoise"  , 2, 0, [                     ], [ 2 ] ],
        [ "WhiteNoise"  , 2, 0, [                     ], [ 2 ] ],
        [ "BinaryOpUGen", 2, 2, [ [  0, 0 ], [ 1, 0 ] ], [ 2 ] ],
        [ "Out"         , 2, 0, [ [ -1, 0 ], [ 2, 0 ] ], [   ] ],
      ]
    });
  });

  it("should optimize same node", () => {
    const node = Out.ar(0, add(SinOsc.ar(), SinOsc.ar()));
    const sdef = build("temp", [ node ]);

    assert.deepEqual(sdef, {
      name: "temp",
      consts: [ 0, 440 ],
      units: [
        [ "SinOsc"      , 2, 0, [ [ -1, 1 ], [ -1, 0 ] ], [ 2 ] ],
        [ "BinaryOpUGen", 2, 0, [ [  0, 0 ], [  0, 0 ] ], [ 2 ] ],
        [ "Out"         , 2, 0, [ [ -1, 0 ], [  1, 0 ] ], [   ] ],
      ]
    });
  });

  it("should optimize same OutputProxy", () => {
    const node = Out.ar(0, add(
      Pan2.ar(SinOsc.ar(), SinOsc.kr(1)),
      Pan2.ar(SinOsc.ar(), SinOsc.kr(1))
    ));
    const sdef = build("temp", [ node ]);

    assert.deepEqual(sdef, {
      name: "temp",
      consts: [ 0, 440, 1 ],
      units: [
        [ "SinOsc"      , 2, 0, [ [ -1, 1 ], [ -1, 0 ]            ], [ 2    ] ],
        [ "SinOsc"      , 1, 0, [ [ -1, 2 ], [ -1, 0 ]            ], [ 1    ] ],
        [ "Pan2"        , 2, 0, [ [  0, 0 ], [  1, 0 ], [ -1, 2 ] ], [ 2, 2 ] ],
        [ "BinaryOpUGen", 2, 0, [ [  2, 0 ], [  2, 0 ]            ], [ 2    ] ],
        [ "BinaryOpUGen", 2, 0, [ [  2, 1 ], [  2, 1 ]            ], [ 2    ] ],
        [ "Out"         , 2, 0, [ [ -1, 0 ], [  3, 0 ], [  4, 0 ] ], [      ] ],
      ]
    });
  });

  it("should optimize same Control", () => {
    const node = Out.ar(0, add(
      add(SinOsc.ar(ctl("freq", [ 440, 442 ])[0]), SinOsc.ar(ctl("freq", [ 440, 442 ])[1])),
      add(SinOsc.ar(ctl("freq", [ 440, 442 ])[0]), SinOsc.ar(ctl("freq", [ 440, 442 ])[1]))
    ));
    const sdef = build("temp", [ node ]);

    assert.deepEqual(sdef, {
      name: "temp",
      consts: [ 0 ],
      paramValues: [ 440, 442 ],
      paramIndices: [
        { name: "freq", index: 0, length: 2 }
      ],
      units: [
        [ "Control", 1, 0, [                                            ], [ 1, 1 ] ],
        [ "SinOsc" , 2, 0, [ [  0, 0 ], [ -1, 0 ]                       ], [ 2    ] ],
        [ "SinOsc" , 2, 0, [ [  0, 1 ], [ -1, 0 ]                       ], [ 2    ] ],
        [ "Sum4"   , 2, 0, [ [  1, 0 ], [  2, 0 ], [  1, 0 ], [  2, 0 ] ], [ 2    ] ],
        [ "Out"    , 2, 0, [ [ -1, 0 ], [  3, 0 ]                       ], [      ] ],
      ]
    });
  });

  it("should throw Error when invalid controls (different length)", () => {
    const freq1 = ctl("freq", 440);
    const freq2 = ctl("freq", [ 440, 442 ]);
    const node = Out.ar(0, SinOsc.ar([ freq1 ].concat(freq2)));

    assert.throws(() => {
      build("temp", [ node ]);
    }, TypeError);
  });

  it("should throw Error when invalid controls (different value)", () => {
    const freq1 = ctl("freq", 440);
    const freq2 = ctl("freq", 442);
    const node = Out.ar(0, SinOsc.ar([ freq1, freq2 ]));

    assert.throws(() => {
      build("temp", [ node ]);
    }, TypeError);
  });

  it("should throw Error when invalid controls (different rate)", () => {
    const freq1 = ctl.kr("freq", 440);
    const freq2 = ctl.ar("freq", 440);
    const node = Out.ar(0, SinOsc.ar([ freq1, freq2 ]));

    assert.throws(() => {
      build("temp", [ node ]);
    }, TypeError);
  });
});
