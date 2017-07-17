import assert from "assert";
import sinon from "sinon";
import { EventEmitter } from "events";
import NeuContext from "../../../src/neume/core/NeuContext";
import NeuSDef from "../../../src/neume/inst/NeuSDef";
import NeuInstrument from "../../../src/neume/inst/NeuInstrument";
import NeuNode from "../../../src/neume/node/NeuNode";
import * as commands from "../../../src/scsynth/commands";
import { bindArgs } from "../../../src/neume/inst/NeuInstrument";

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

const sdefJSON = {
  name: "temp",
  consts: [ 0 ],
  paramValues: [ 0, 440 ],
  paramIndices: [
    { name: "freq" , index: 1, length: 1 },
    { name: "out:0", index: 0, length: 1 },
  ],
  units: [
    [ "Control", 0, 0, [                     ], [ 0 ] ],
    [ "Control", 1, 1, [                     ], [ 1 ] ],
    [ "SinOsc" , 2, 0, [ [ 1, 0 ], [ -1, 0 ] ], [ 2 ] ],
    [ "Out"    , 2, 0, [ [ 0, 0 ], [  2, 0 ] ], [   ] ],
  ]
};

describe("neume/inst/NeuInstrument", () => {
  describe("create(context, ...args)", () => {
    it("should create NeuInstrument instance", () => {
      const context = new TestContext();
      const sdef = NeuInstrument.create(context, sdefJSON);

      assert(sdef instanceof NeuInstrument);
      assert(sdef.context === context);
    });
  });

  describe("constructor(context, sdef, params, target, action)", () => {
    it("should create NeuInstrument instance", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);

      assert(inst instanceof NeuInstrument);
      assert(inst.context === context);
      assert(inst.sdef === sdef);
    });
  });

  describe(".sdefName", () => {
    it("should be sdef name", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);

      assert(inst.sdefName === sdef.name);
    });
  });

  describe(".ctlNames", () => {
    it("should be sdef ctlNames", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);

      assert.deepEqual(inst.ctlNames, sdef.ctlNames);
    });
  });

  describe(".numberOfInputs", () => {
    it("should be sdef numberOfInputs", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);

      assert(inst.numberOfInputs === sdef.numberOfInputs);
    });
  });

  describe(".numberOfOutputs", () => {
    it("should be sdef numberOfOutputs", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);

      assert(inst.numberOfOutputs === sdef.numberOfOutputs);
    });
  });

  describe(".params", () => {
    it("should be target if given", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef, { freq: 440 });

      assert.deepEqual(inst.params, { freq: 440 });
    });

    it("should be null if not given", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);

      assert(inst.params === null);
    });
  });

  describe(".target", () => {
    it("should be target if given", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const node = new NeuNode(context, 1001);
      const inst = new NeuInstrument(context, sdef, null, node);

      assert(inst.target === node);
    });

    it("should be null if not given", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);

      assert(inst.target === null);
    });
  });

  describe(".action", () => {
    it("should be action if given", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const node = new NeuNode(context, 1001);
      const inst = new NeuInstrument(context, sdef, null, node, "addToTail");

      assert(inst.action === "addToTail");
    });

    it("should be null if not given", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);

      assert(inst.action === null);
    });
  });

  describe(".ctls(name)", () => {
    it("should call sdef.ctls(name)", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);

      sdef.ctls = sinon.spy(sdef.ctls.bind(sdef));

      const data = inst.ctls("freq");

      assert(sdef.ctls.args[0], [ "freq" ]);
      assert.deepEqual(data, sdef.ctls.returnValues[0]);
    });
  });

  describe(".inputs(n)", () => {
    it("should call sdef.inputs(n)", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);

      sdef.inputs = sinon.spy(sdef.inputs.bind(sdef));

      const data = inst.inputs(0);

      assert(sdef.inputs.args[0], [ 0 ]);
      assert.deepEqual(data, sdef.inputs.returnValues[0]);
    });
  });

  describe(".outputs(n)", () => {
    it("should call sdef.outputs(n)", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);

      sdef.outputs = sinon.spy(sdef.outputs.bind(sdef));

      const data = inst.outputs(0);

      assert(sdef.outputs.args[0], [ 0 ]);
      assert.deepEqual(data, sdef.outputs.returnValues[0]);
    });
  });
});

describe("neume/inst/NeuInstrument/bindArgs(context, args)", () => {
  it("(sdef)", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefJSON);
    const args = bindArgs(context, [ sdef ]);

    assert.deepEqual(args, [ context, sdef, null, null, null ]);
  });

  it("(sdef, params)", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefJSON);
    const args = bindArgs(context, [ sdef, { freq: 440 } ]);

    assert.deepEqual(args, [ context, sdef, { freq: 440 }, null, null ]);
  });

  it("(sdef, target)", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefJSON);
    const node = new NeuNode(context, 1001);
    const args = bindArgs(context, [ sdef, node ]);

    assert.deepEqual(args, [ context, sdef, null, node, null ]);
  });

  it("(sdef, params, target)", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefJSON);
    const node = new NeuNode(context, 1001);
    const args = bindArgs(context, [ sdef, { freq: 440 }, node ]);

    assert.deepEqual(args, [ context, sdef, { freq: 440 }, node, null ]);
  });

  it("(sdef, target, action)", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefJSON);
    const node = new NeuNode(context, 1001);
    const args = bindArgs(context, [ sdef, node, "addToTail" ]);

    assert.deepEqual(args, [ context, sdef, null, node, "addToTail" ]);
  });

  it("(sdef, params, target, action)", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefJSON);
    const node = new NeuNode(context, 1001);
    const args = bindArgs(context, [ sdef, { freq: 440 }, node, "addToTail" ]);

    assert.deepEqual(args, [ context, sdef, { freq: 440 }, node, "addToTail" ]);
  });

  it("(sdef: string)", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefJSON);
    const args = bindArgs(context, [ sdef.name ]);

    assert.deepEqual(args, [ context, sdef, null, null, null ]);
  });

  it("(sdef: function)", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefJSON);
    const args = bindArgs(context, [ function temp(freq = 440, { SinOsc }) {
      return SinOsc.ar(freq);
    } ]);

    assert.deepEqual(args, [ context, sdef, null, null, null ]);
  });

  it("(sdef: json)", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefJSON);
    const args = bindArgs(context, [ sdefJSON ]);

    assert.deepEqual(args, [ context, sdef, null, null, null ]);
  });

  it("else case should throw TypeError", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefJSON);

    assert.throws(() => {
      bindArgs(context, []);
    }, TypeError);

    assert.throws(() => {
      bindArgs(context, [ sdef, null ]);
    }, TypeError);

    assert.throws(() => {
      bindArgs(context, [ sdef, null, null ]);
    }, TypeError);

    assert.throws(() => {
      bindArgs(context, [ sdef, null, null, null ]);
    }, TypeError);
  });
});
