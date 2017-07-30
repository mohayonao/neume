import assert from "assert";
import sdefBuild, { createCtl, createInAPI, createOutAPI } from "../../../src/neume/utils/sdefBuild";
import scapi from "../../../src/scapi";

const { In, Out, SinOsc } = scapi;

function ctl(name) {
  const node = scapi.ctl.ir("name");
  node.type = "#" + name;
  return node;
}

describe("neume/utils/sdefBuild(name, func)", () => {
  it("should create sdef json using return value as Out", () => {
    const sdef = sdefBuild("temp", () => {
      return SinOsc.ar(440);
    });

    assert.deepEqual(sdef, {
      name: "temp",
      consts: [ 440, 0 ],
      paramValues: [ 0 ],
      paramIndices: [
        { name: "out:0", index: 0, length: 1 },
      ],
      units: [
        [ "Control", 0, 0, [                      ], [ 0 ] ],
        [ "SinOsc" , 2, 0, [ [ -1, 0 ], [ -1, 1 ] ], [ 2 ] ],
        [ "Out"    , 2, 0, [ [  0, 0 ], [  1, 0 ] ], [   ] ],
      ]
    });
  });

  it("should create sdef json using return values as Out", () => {
    const sdef = sdefBuild("temp", () => {
      return SinOsc.ar([ 440, 442 ]);
    });

    assert.deepEqual(sdef, {
      name: "temp",
      consts: [ 440, 0, 442 ],
      paramValues: [ 0 ],
      paramIndices: [
        { name: "out:0", index: 0, length: 1 },
      ],
      units: [
        [ "Control", 0, 0, [                                ], [ 0 ] ],
        [ "SinOsc" , 2, 0, [ [ -1, 0 ], [ -1, 1 ]           ], [ 2 ] ],
        [ "SinOsc" , 2, 0, [ [ -1, 2 ], [ -1, 1 ]           ], [ 2 ] ],
        [ "Out"    , 2, 0, [ [  0, 0 ], [  1, 0 ], [ 2, 0 ] ], [   ] ],
      ]
    });
  });

  it("should create sdef json using Out", () => {
    const sdef = sdefBuild("temp", () => {
      return Out.ar(1, SinOsc.ar(440));
    });

    assert.deepEqual(sdef, {
      name: "temp",
      consts: [ 1, 440, 0 ],
      units: [
        [ "SinOsc" , 2, 0, [ [ -1, 1 ], [ -1, 2 ] ], [ 2 ] ],
        [ "Out"    , 2, 0, [ [ -1, 0 ], [  0, 0 ] ], [   ] ],
      ]
    });
  });

  it("should create sdef json using ($in, $out) api", () => {
    const sdef = sdefBuild("temp", ($in, $out) => {
      const sin = SinOsc.ar($in.kr(), $in.kr());

      $out([ sin, sin ]);
      $out([ sin, sin ]);
    });

    assert.deepEqual(sdef, {
      name: "temp",
      consts: [],
      paramValues: [ 0, 0, 0, 0 ],
      paramIndices: [
        { name: "out:0", index: 0, length: 1 },
        { name: "in:0" , index: 1, length: 1 },
        { name: "in:1" , index: 2, length: 1 },
        { name: "out:1", index: 3, length: 1 },
      ],
      units: [
        [ "Control", 0, 0, [                              ], [ 0, 0, 0, 0 ] ],
        [ "In"     , 1, 0, [ [ 0, 1 ]                     ], [ 1          ] ],
        [ "In"     , 1, 0, [ [ 0, 2 ]                     ], [ 1          ] ],
        [ "SinOsc" , 2, 0, [ [ 1, 0 ], [ 2, 0 ]           ], [ 2          ] ],
        [ "Out"    , 2, 0, [ [ 0, 0 ], [ 3, 0 ], [ 3, 0 ] ], [            ] ],
        [ "Out"    , 2, 0, [ [ 0, 3 ], [ 3, 0 ], [ 3, 0 ] ], [            ] ],
      ]
    });
  });

  it("should create sdef json usint ctl api", () => {
    const sdef = sdefBuild("temp", (freq = [ 440, 442 ], volume = 0.1) => {
      return SinOsc.ar(freq, { mul: volume });
    });

    assert.deepEqual(sdef, {
      name: "temp",
      consts: [ 0 ],
      paramValues: [ 0, 440, 442, 0.1 ],
      paramIndices: [
        { name: "freq"  , index: 1, length: 2 },
        { name: "volume", index: 3, length: 1 },
        { name: "out:0" , index: 0, length: 1 },
      ],
      units: [
        [ "Control"     , 0, 0, [                              ], [ 0       ] ],
        [ "Control"     , 1, 1, [                              ], [ 1, 1, 1 ] ],
        [ "SinOsc"      , 2, 0, [ [ 1, 0 ], [ -1, 0 ]          ], [ 2       ] ],
        [ "BinaryOpUGen", 2, 2, [ [ 2, 0 ], [  1, 2 ]          ], [ 2       ] ],
        [ "SinOsc"      , 2, 0, [ [ 1, 1 ], [ -1, 0 ]          ], [ 2       ] ],
        [ "BinaryOpUGen", 2, 2, [ [ 4, 0 ], [  1, 2 ]          ], [ 2       ] ],
        [ "Out"         , 2, 0, [ [ 0, 0 ], [  3, 0 ],[ 5, 0 ] ], [         ] ],
      ]
    });
  });

  it("should create sdef json usint ctl api (fplist)", () => {
    const sdef = sdefBuild("temp", (f, v, { mul }) => {
      return mul(SinOsc.ar(f), v);
    }, [ "freq=[ 440, 442 ]", "volume=0.1", "$scapi" ]);

    assert.deepEqual(sdef, {
      name: "temp",
      consts: [ 0 ],
      paramValues: [ 0, 440, 442, 0.1 ],
      paramIndices: [
        { name: "freq"  , index: 1, length: 2 },
        { name: "volume", index: 3, length: 1 },
        { name: "out:0" , index: 0, length: 1 },
      ],
      units: [
        [ "Control"     , 0, 0, [                              ], [ 0       ] ],
        [ "Control"     , 1, 1, [                              ], [ 1, 1, 1 ] ],
        [ "SinOsc"      , 2, 0, [ [ 1, 0 ], [ -1, 0 ]          ], [ 2       ] ],
        [ "BinaryOpUGen", 2, 2, [ [ 2, 0 ], [  1, 2 ]          ], [ 2       ] ],
        [ "SinOsc"      , 2, 0, [ [ 1, 1 ], [ -1, 0 ]          ], [ 2       ] ],
        [ "BinaryOpUGen", 2, 2, [ [ 4, 0 ], [  1, 2 ]          ], [ 2       ] ],
        [ "Out"         , 2, 0, [ [ 0, 0 ], [  3, 0 ],[ 5, 0 ] ], [         ] ],
      ]
    });
  });
});

describe("neume/utils/sdefBuild/createCtl(name, rate, value)", () => {
  it("should create ar rate control", () => {
    const node = createCtl("freq", "ar", 440);

    assert.deepEqual(node, scapi.ctl.ar("freq", 440));
  });

  it("should create kr rate control", () => {
    const node = createCtl("freq", "kr", 440);

    assert.deepEqual(node, scapi.ctl.kr("freq", 440));
  });

  it("should create ir rate control", () => {
    const node = createCtl("freq", "ir", 440);

    assert.deepEqual(node, scapi.ctl.ir("freq", 440));
  });

  it("should create tr rate control", () => {
    const node = createCtl("freq", "tr", 440);

    assert.deepEqual(node, scapi.ctl.tr("freq", 440));
  });

  it("should create default rate control", () => {
    const node = createCtl("freq", "", 440);

    assert.deepEqual(node, scapi.ctl.kr("freq", 440));
  });
});

describe("neume/utils/sdefBuild/createInAPI({ inputs })", () => {
  it("should be function", () => {
    const context = { inputs: [] };
    const $in = createInAPI(context);

    assert(typeof $in === "function");
    assert(typeof $in.ar === "function");
    assert(typeof $in.kr === "function");
  });

  it("should create In with ctl", () => {
    const context = { inputs: [] };
    const $in = createInAPI(context);

    const node1 = $in();

    assert(node1 === context.inputs[0]);
    assert.deepEqual(context.inputs[0], In.ar(ctl("in:0"), 1));

    const node2 = $in.ar(2);

    assert(node2 === context.inputs[1]);
    assert.deepEqual(context.inputs[1], In.ar(ctl("in:1"), 2));

    const node3 = $in.kr(4);

    assert(node3 === context.inputs[2]);
    assert.deepEqual(context.inputs[2], In.kr(ctl("in:2"), 4));
  });
});

describe("neume/utils/sdefBuild/createOutAPI({ outputs })", () => {
  it("should be function", () => {
    const context = { outputs: [] };
    const $out = createOutAPI(context);

    assert(typeof $out === "function");
    assert(typeof $out.ar === "function");
    assert(typeof $out.kr === "function");
  });

  it("should create Out with ctl", () => {
    const context = { outputs: [] };
    const $out = createOutAPI(context);

    const node1 = $out(SinOsc.ar(440));

    assert(node1 === 0);
    assert.deepEqual(context.outputs[0], Out.ar(ctl("out:0"), SinOsc.ar(440)));

    const node2 = $out.ar(SinOsc.ar([ 440, 442 ]));

    assert(node2 === 0);
    assert.deepEqual(context.outputs[1], Out.ar(ctl("out:1"), SinOsc.ar([ 440, 442 ])));

    const node3 = $out.kr(SinOsc.kr([ 1, 2, 3, 4 ]));

    assert(node3 === 0);
    assert.deepEqual(context.outputs[2], Out.kr(ctl("out:2"), SinOsc.kr([ 1, 2, 3, 4 ])));
  });
});
