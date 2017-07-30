import assert from "assert";
import sdefAnalyze from "../../../src/neume/utils/sdefAnalyze";

describe("neume/utils/sdefAnalyze(sdef)", () => {
  it("ctls should be mapped params by name", () => {
    const sdef = {
      name: "temp",
      consts: [ 0 ],
      paramValues: [ 440, 442, 0, 0.25 ],
      paramIndices: [
        { name: "freq"  , index: 0, length: 2 },
        { name: "phase" , index: 2, length: 1 },
        { name: "volume", index: 3, length: 1 },
      ],
      units: [
        [ "Control"     , 1, 0, [                               ], [ 0, 0, 0, 0 ] ],
        [ "SinOsc"      , 2, 0, [ [  0, 0 ], [ 0, 2 ]           ], [ 2          ] ],
        [ "SinOsc"      , 2, 0, [ [  0, 1 ], [ 0, 2 ]           ], [ 2          ] ],
        [ "BinaryOpUGen", 2, 2, [ [  1, 0 ], [ 0, 3 ]           ], [ 2          ] ],
        [ "BinaryOpUGen", 2, 2, [ [  2, 0 ], [ 0, 3 ]           ], [ 2          ] ],
        [ "Out"         , 2, 0, [ [ -1, 0 ], [ 3, 0 ], [ 4, 0 ] ], [            ] ],
      ]
    };
    const meta = sdefAnalyze(sdef);

    assert.deepEqual(meta.ctls, {
      "freq"  : { name: "freq"  , index: 0, length: 2, values: [ 440, 442] },
      "phase" : { name: "phase" , index: 2, length: 1, values: [ 0 ] },
      "volume": { name: "volume", index: 3, length: 1, values: [ 0.25 ] },
    });
    assert.deepEqual(meta.inputs, []);
    assert.deepEqual(meta.outputs, []);
  });

  it("inputs should be collected params for inputs", () => {
    const sdef = {
      name: "temp",
      const: [ 0 ],
      paramValues: [ 0, 0 ],
      paramIndices: [
        { name: "in:0", index: 0, length: 1 },
        { name: "in:1", index: 1, length: 1 },
      ],
      units: [
        [ "Control", 0, 0, [                               ], [ 0, 0 ] ],
        [ "In"     , 2, 0, [ [  0, 0 ]                     ], [ 2, 2 ] ],
        [ "In"     , 1, 0, [ [  0, 1 ]                     ], [ 1    ] ],
        [ "LPF"    , 2, 0, [ [  1, 0 ], [ 2, 0 ]           ], [ 2    ] ],
        [ "LPF"    , 2, 0, [ [  1, 1 ], [ 2, 0 ]           ], [ 2    ] ],
        [ "Out"    , 2, 0, [ [ -1, 0 ], [ 3, 0 ], [ 4, 0 ] ], [      ] ],
      ]
    };
    const meta = sdefAnalyze(sdef);

    assert.deepEqual(meta.ctls, {});
    assert.deepEqual(meta.inputs, [
      { rate: 2, index: 0, length: 2 },
      { rate: 1, index: 1, length: 1 },
    ]);
    assert.deepEqual(meta.outputs, []);
  });

  it("output", () => {
    const sdef = {
      name: "temp",
      const: [ 440, 0 ],
      paramValues: [ 0, 0 ],
      paramIndices: [
        { name: "out:0", index: 0, length: 1 },
        { name: "out:1", index: 1, length: 1 },
      ],
      units: [
        [ "Control", 0, 0, [                                ], [ 0, 0 ] ],
        [ "SinOsc" , 2, 0, [ [ -1, 0 ], [ -1, 1 ]           ], [ 2    ] ],
        [ "Out"    , 2, 0, [ [  0, 0 ], [  1, 0 ], [ 1, 0 ] ], [      ] ],
        [ "Out"    , 1, 0, [ [  0, 1 ], [  1, 0 ]           ], [      ] ],
      ]
    };
    const meta = sdefAnalyze(sdef);

    assert.deepEqual(meta.ctls, {});
    assert.deepEqual(meta.inputs, []);
    assert.deepEqual(meta.outputs, [
      { rate: 2, index: 0, length: 2 },
      { rate: 1, index: 1, length: 1 },
    ]);
  });

  it("empty case", () => {
    const sdef = {
      name: "temp",
      const: [],
      units: []
    };
    const meta = sdefAnalyze(sdef);

    assert.deepEqual(meta.ctls, {});
    assert.deepEqual(meta.inputs, []);
    assert.deepEqual(meta.outputs, []);
  });
});
