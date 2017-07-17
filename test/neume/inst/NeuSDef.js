import assert from "assert";
import sinon from "sinon";
import { EventEmitter } from "events";
import NeuContext from "../../../src/neume/core/NeuContext";
import NeuSDef from "../../../src/neume/inst/NeuSDef";
import * as commands from "../../../src/scsynth/commands";
import { prependDRecvIfNeeded, bindArgs } from "../../../src/neume/inst/NeuSDef";
import { CONTROL, AUDIO } from "../../../src/neume/constants";

class TestServer extends EventEmitter {
  constructor() {
    super();
    this.commands = commands;
    this.sendOSC = sinon.spy();
  }
}

class TestContext extends NeuContext {
  constructor() {
    super({ ServerClass: TestServer });
    Object.getOwnPropertyNames(NeuContext.prototype).forEach((name) => {
      this[name] = sinon.spy(this[name].bind(this));
    });
  }
}

const sdefParam = {
  name: "temp",
  consts: [ 0 ],
  paramValues: [ 440, 0 ],
  paramIndices: [
    { name: "freq" , index: 0, length: 1 },
    { name: "phase", index: 1, length: 1 },
  ],
  units: [
    [ "Control", 1, 0, [                               ], [ 1, 1 ] ],
    [ "SinOsc" , 2, 0, [ [  0, 0 ], [ 0, 1 ]           ], [ 2    ] ],
    [ "Out"    , 2, 0, [ [ -1, 0 ], [ 1, 0 ], [ 1, 0 ] ], [ 2    ] ],
  ]
};

const sdefIn = {
  name: "temp-in",
  consts: [ 0 ],
  paramValues: [ 0, 0, 0 ],
  paramIndices: [
    { name: "in:0", index: 0, length: 2 },
    { name: "in:1", index: 2, length: 1 },
  ],
  units: [
    [ "Control", 0, 0, [                               ], [ 0, 0, 0 ] ],
    [ "In"     , 1, 0, [ [  0, 0 ]                     ], [ 1, 1    ] ],
    [ "In"     , 1, 0, [ [  0, 2 ]                     ], [ 1       ] ],
    [ "SinOsc" , 2, 0, [ [  1, 0 ], [ 2, 0 ]           ], [ 2       ] ],
    [ "SinOsc" , 2, 0, [ [  1, 1 ], [ 2, 0 ]           ], [ 2       ] ],
    [ "Out"    , 2, 0, [ [ -1, 0 ], [ 3, 0 ], [ 3, 0 ] ], [         ] ],
  ]
};

const sdefOut = {
  name: "temp-out",
  consts: [ 440, 0, 1 ],
  paramValues: [ 0, 0 ],
  paramIndices: [
    { name: "out:0", index: 0, length: 1 },
    { name: "out:1", index: 1, length: 1 },
  ],
  units: [
    [ "Control", 0, 0, [                                ], [ 0, 0 ] ],
    [ "SinOsc" , 2, 0, [ [ -1, 0 ], [ -1, 1 ]           ], [ 2    ] ],
    [ "SinOsc" , 1, 0, [ [ -1, 2 ], [ -1, 1 ]           ], [ 1    ] ],
    [ "Out"    , 2, 0, [ [  0, 0 ], [  1, 0 ], [ 1, 0 ] ], [      ] ],
    [ "Out"    , 1, 0, [ [  0, 1 ], [  2, 0 ]           ], [      ] ],
  ]
};

describe("neume/inst/NeuSDef", () => {
  describe("create(context, ...args)", () => {
    it("should create NeuSDef instance", () => {
      const context = new TestContext();
      const sdef = NeuSDef.create(context, sdefParam);

      assert(sdef instanceof NeuSDef);
      assert(sdef.context === context);
    });
  });

  describe("constructor(context, sdef, opts)", () => {
    it("should create NeuSDef instance", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefParam);

      assert(sdef instanceof NeuSDef);
      assert(sdef.context === context);
      assert(sdef.sdef === sdefParam);
    });

    it("should send d_recv command to server", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefParam);

      assert(sdef.sdef === sdefParam);
      assert(context.sendOSC.args[0], [ {
        address: "/d_recv",
        args: [
          { type: "blob", value: sdef.sdef },
        ]
      } ]);
    });

    it("should not send d_recv command to server when opts.noSend", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefParam, { noSend: true });

      assert(sdef.sdef === sdefParam);
      assert(context.sendOSC.callCount === 0);
    });

    it("should register to context", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefParam);

      assert(context.getSDefByName(sdef.name) === sdef);
    });

    it("should not register to context when opts.noRegisterf", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefParam, { noRegister: true });

      assert(context.getSDefByName(sdef.name) === null);
    });
  });

  describe(".name", () => {
    it("should be sdef name", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefParam);

      assert(sdef.name === sdefParam.name);
    });
  });

  describe(".ctlNames", () => {
    it("should be array of control names", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefParam);

      assert.deepEqual(sdef.ctlNames, [ "freq", "phase" ]);
    });
  });

  describe(".numberOfInputs", () => {
    it("should be number of inputs", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefIn);

      assert(sdef.numberOfInputs === 2);
    });

    it("should be number of inputs", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefParam);

      assert(sdef.numberOfInputs === 0);
    });
  });

  describe(".numberOfOutputs", () => {
    it("should be number of outputs", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefOut);

      assert(sdef.numberOfOutputs === 2);
    });

    it("should be number of outputs", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefParam);

      assert(sdef.numberOfOutputs === 0);
    });
  });

  describe(".ctls(name)", () => {
    it("should return ctl object", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefParam);

      assert.deepEqual(sdef.ctls("freq"), {
        name: "freq", index: 0, length: 1, values: [ 440 ]
      });
      assert.deepEqual(sdef.ctls("phase"), {
        name: "phase", index: 1, length: 1, values: [ 0 ]
      });
    });

    it("should return null when unknown control", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefParam);

      assert(sdef.ctls("unknown") === null);
    });
  });

  describe(".inputs(n)", () => {
    it("should return input object", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefIn);

      assert.deepEqual(sdef.inputs(0), {
        rate: CONTROL, index: 0, length: 2
      });
      assert.deepEqual(sdef.inputs(1), {
        rate: CONTROL, index: 2, length: 1
      });
    });

    it("should return null when out range of channels", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefIn);

      assert(sdef.inputs(100) === null);
    });
  });

  describe(".outputs(n)", () => {
    it("should return input object", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefOut);

      assert.deepEqual(sdef.outputs(0), {
        rate: AUDIO, index: 0, length: 2
      });
      assert.deepEqual(sdef.outputs(1), {
        rate: CONTROL, index: 1, length: 1
      });
    });

    it("should return null when out range of channels", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefOut);

      assert(sdef.outputs(100) === null);
    });
  });

  describe(".free()", () => {
    it("should send f_free command to server", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefParam);

      context.sendOSC.reset();

      sdef.free();

      assert.deepEqual(context.sendOSC.args[0], [ {
        address: "/d_free",
        args: [
          { type: "string", value: sdef.name },
        ]
      } ]);
    });
  });

  describe(".send()", () => {
    it("should send d_recv command to server when not send yet", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefParam, { noSend: true });

      assert(context.sendOSC.callCount === 0);

      sdef.send();

      assert(context.sendOSC.callCount === 1);
      assert(context.sendOSC.args[0], [ {
        address: "/d_recv",
        args: [
          { type: "blob", value: sdef.sdef },
        ]
      } ]);

      sdef.send();

      assert(context.sendOSC.callCount === 1, "send once");
    });
  });
});

describe("neume/inst/NeuSDef/prependDRecvIfNeeded(sdef, cmd)", () => {
  it("should prepend d_recv to command, when d_recv is not done yet", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefParam);
    const s_new = commands.s_new("beep", 1001, 0, 1000);
    const cmd = prependDRecvIfNeeded(sdef, s_new);

    assert.deepEqual(cmd, {
      address: "/d_recv",
      args: [
        { type: "blob", value: sdefParam },
        { type: "blob", value: s_new },
      ]
    });
  });

  it("should NOT prepend d_recv to command, after d_recv is done", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefParam);

    context.sendOSC.lastCall.args[1](); // done d_recv

    const s_new = commands.s_new("beep", 1001, 0, 1000);
    const cmd = prependDRecvIfNeeded(sdef, s_new);

    assert(cmd === s_new);
  });
});

describe("neume/sdef/NeuSDef/bindArgs(context, args)", () => {
  it("(sdef)", () => {
    const context = new TestContext();
    const args = bindArgs(context, [ sdefParam ]);

    assert.deepEqual(args, [ context, sdefParam, {} ]);
  });

  it("(buildFn)", () => {
    const context = new TestContext();
    const args = bindArgs(context, [ function(freq, $scapi) {
      const { SinOsc, Out } = $scapi;
      return Out.ar(0, SinOsc.ar(freq));
    } ]);
    const sdef = {
      name: args[1].name,
      consts: [ 0 ],
      paramValues: [ 0 ],
      paramIndices: [ { name: "freq", index: 0, length: 1 } ],
      units: [
        [ "Control", 1, 0, [                      ], [ 1 ] ],
        [ "SinOsc" , 2, 0, [ [  0, 0 ], [ -1, 0 ] ], [ 2 ] ],
        [ "Out"    , 2, 0, [ [ -1, 0 ], [  1, 0 ] ], [   ] ],
      ]
    };

    assert.deepEqual(args, [ context, sdef, {} ]);
  });

  it("(sdef, opts)", () => {
    const context = new TestContext();
    const args = bindArgs(context, [ sdefParam, { noSend: true } ]);

    assert.deepEqual(args, [ context, sdefParam, { noSend: true } ]);
  });

  it("(name, buildFn)", () => {
    const context = new TestContext();
    const args = bindArgs(context, [ "temp", function(freq, { SinOsc, Out }) {
      return Out.ar(0, SinOsc.ar(freq));
    } ]);

    const sdef = {
      name: "temp",
      consts: [ 0 ],
      paramValues: [ 0 ],
      paramIndices: [ { name: "freq", index: 0, length: 1 } ],
      units: [
        [ "Control", 1, 0, [                      ], [ 1 ] ],
        [ "SinOsc" , 2, 0, [ [  0, 0 ], [ -1, 0 ] ], [ 2 ] ],
        [ "Out"    , 2, 0, [ [ -1, 0 ], [  1, 0 ] ], [   ] ],
      ]
    };

    assert.deepEqual(args, [ context, sdef, {} ]);
  });

  it("(buildFn, fnArgs)", () => {
    const context = new TestContext();
    const args = bindArgs(context, [ function(f, { SinOsc, Out }) {
      return Out.ar(0, SinOsc.ar(f));
    }, [ "freq", "$scapi" ] ]);
    const sdef = {
      name: args[1].name,
      consts: [ 0 ],
      paramValues: [ 0 ],
      paramIndices: [ { name: "freq", index: 0, length: 1 } ],
      units: [
        [ "Control", 1, 0, [                      ], [ 1 ] ],
        [ "SinOsc" , 2, 0, [ [  0, 0 ], [ -1, 0 ] ], [ 2 ] ],
        [ "Out"    , 2, 0, [ [ -1, 0 ], [  1, 0 ] ], [   ] ],
      ]
    };

    assert.deepEqual(args, [ context, sdef, {} ]);
  });

  it("(buildFn, opts)", () => {
    const context = new TestContext();
    const args = bindArgs(context, [ function(freq, $scapi) {
      const { SinOsc, Out } = $scapi;
      return Out.ar(0, SinOsc.ar(freq));
    }, { noSend: true } ]);
    const sdef = {
      name: args[1].name,
      consts: [ 0 ],
      paramValues: [ 0 ],
      paramIndices: [ { name: "freq", index: 0, length: 1 } ],
      units: [
        [ "Control", 1, 0, [                      ], [ 1 ] ],
        [ "SinOsc" , 2, 0, [ [  0, 0 ], [ -1, 0 ] ], [ 2 ] ],
        [ "Out"    , 2, 0, [ [ -1, 0 ], [  1, 0 ] ], [   ] ],
      ]
    };

    assert.deepEqual(args, [ context, sdef, { noSend: true } ]);
  });

  it("(name, buildFn, fnArgs)", () => {
    const context = new TestContext();
    const args = bindArgs(context, [ "temp", function(f, { SinOsc, Out }) {
      return Out.ar(0, SinOsc.ar(f));
    }, [ "freq", "$scapi" ] ]);
    const sdef = {
      name: args[1].name,
      consts: [ 0 ],
      paramValues: [ 0 ],
      paramIndices: [ { name: "freq", index: 0, length: 1 } ],
      units: [
        [ "Control", 1, 0, [                      ], [ 1 ] ],
        [ "SinOsc" , 2, 0, [ [  0, 0 ], [ -1, 0 ] ], [ 2 ] ],
        [ "Out"    , 2, 0, [ [ -1, 0 ], [  1, 0 ] ], [   ] ],
      ]
    };

    assert.deepEqual(args, [ context, sdef, {} ]);
  });

  it("(name, buildFn, opts)", () => {
    const context = new TestContext();
    const args = bindArgs(context, [ "temp", function(freq, { SinOsc, Out }) {
      return Out.ar(0, SinOsc.ar(freq));
    }, { noSend: true } ]);

    const sdef = {
      name: "temp",
      consts: [ 0 ],
      paramValues: [ 0 ],
      paramIndices: [ { name: "freq", index: 0, length: 1 } ],
      units: [
        [ "Control", 1, 0, [                      ], [ 1 ] ],
        [ "SinOsc" , 2, 0, [ [  0, 0 ], [ -1, 0 ] ], [ 2 ] ],
        [ "Out"    , 2, 0, [ [ -1, 0 ], [  1, 0 ] ], [   ] ],
      ]
    };

    assert.deepEqual(args, [ context, sdef, { noSend: true } ]);
  });

  it("(name, buildFn, fnArgs, opts)", () => {
    const context = new TestContext();
    const args = bindArgs(context, [ "temp", function(f, { SinOsc, Out }) {
      return Out.ar(0, SinOsc.ar(f));
    }, [ "freq", "$scapi" ], { noSend: true } ]);
    const sdef = {
      name: args[1].name,
      consts: [ 0 ],
      paramValues: [ 0 ],
      paramIndices: [ { name: "freq", index: 0, length: 1 } ],
      units: [
        [ "Control", 1, 0, [                      ], [ 1 ] ],
        [ "SinOsc" , 2, 0, [ [  0, 0 ], [ -1, 0 ] ], [ 2 ] ],
        [ "Out"    , 2, 0, [ [ -1, 0 ], [  1, 0 ] ], [   ] ],
      ]
    };

    assert.deepEqual(args, [ context, sdef, { noSend: true } ]);
  });

  it("else case should throw TypeError", () => {
    const context = new TestContext();

    assert.throws(() => {
      bindArgs(context, []);
    }, TypeError);

    assert.throws(() => {
      bindArgs(context, [ null ]);
    }, TypeError);

    assert.throws(() => {
      bindArgs(context, [ null, null ]);
    }, TypeError);

    assert.throws(() => {
      bindArgs(context, [ null, null, null ]);
    }, TypeError);

    assert.throws(() => {
      bindArgs(context, [ null, null, null, null ]);
    }, TypeError);
  });
});
