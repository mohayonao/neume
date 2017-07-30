import assert from "assert";
import sinon from "sinon";
import { EventEmitter } from "events";
import NeuBus from "../../../src/neume/core/NeuBus";
import NeuContext from "../../../src/neume/core/NeuContext";
import NeuSDef from "../../../src/neume/inst/NeuSDef";
import NeuInstrument from "../../../src/neume/inst/NeuInstrument";
import NeuNode from "../../../src/neume/node/NeuNode";
import NeuSynth from "../../../src/neume/node/NeuSynth";
import { bindArgs } from "../../../src/neume/node/NeuSynth";
import { CONTROL, AUDIO } from "../../../src/neume/constants";
import * as commands from "../../../src/scsynth/commands";

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
    this.sendOSC = sinon.spy((_, fn) => void(fn && fn()));
  }
}

const sdefJSON = {
  name: "temp",
  consts: [],
  paramValues: [ 0, 0, 0, 0, 440, 442, 0.2 ],
  paramIndices: [
    { name: "freq"  , index: 4, length: 2 },
    { name: "volume", index: 6, length: 1 },
    { name: "in:0"  , index: 0, length: 1 },
    { name: "in:1"  , index: 1, length: 1 },
    { name: "out:0" , index: 2, length: 1 },
    { name: "out:1" , index: 3, length: 1 },
  ],
  units: [
    [ "Control"     , 0, 0, [                              ], [ 0, 0, 0, 0 ] ],
    [ "Control"     , 1, 4, [                              ], [ 1, 1, 1    ] ],
    [ "In"          , 2, 0, [ [ 0, 0 ]                     ], [ 2, 2       ] ],
    [ "In"          , 1, 0, [ [ 0, 1 ]                     ], [ 1          ] ],
    [ "RLPF"        , 2, 0, [ [ 2, 0 ], [ 1, 0 ], [ 3, 0 ] ], [ 2          ] ],
    [ "RLPF"        , 2, 0, [ [ 2, 1 ], [ 1, 1 ], [ 3, 0 ] ], [ 2          ] ],
    [ "BinaryOpUGen", 2, 2, [ [ 4, 0 ], [ 1, 2 ]           ], [ 2          ] ],
    [ "BinaryOpUGen", 2, 2, [ [ 5, 0 ], [ 1, 2 ]           ], [ 2          ] ],
    [ "Out"         , 2, 0, [ [ 0, 2 ], [ 6, 0 ], [ 7, 0 ] ], [            ] ],
    [ "Out"         , 1, 0, [ [ 0, 3 ], [ 1, 1 ]           ], [            ] ],
  ],
};

describe("neume/node/NeuSynth", () => {
  describe("create(context, ...args)", () => {
    it("should create NeuSynth instance", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);
      const node = NeuSynth.create(context, inst);

      assert(node instanceof NeuSynth);
      assert(node.context === context);
    });
  });

  describe("constructor(context, inst, params, nodeId, target, action)", () => {
    it("should create NeuSynth instance", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);
      const node = new NeuSynth(context, inst, {}, 1001);

      assert(node instanceof NeuSynth);
      assert(node instanceof NeuNode);
      assert(node.context === context);
      assert(node.nodeId === 1001);
      assert(node.inst === inst);
    });

    it("should send s_new command to server", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);
      const node0 = new NeuNode(context, 1000);
      const node1 = new NeuSynth(context, inst, {}, 1001, node0, "addToTail");

      assert.deepEqual(context.sendOSC.args[1], [ {
        address: "/s_new",
        args: [
          { type: "string" , value: inst.sdefName },
          { type: "integer", value: node1.nodeId },
          { type: "integer", value: 1 },
          { type: "integer", value: node0.nodeId },
          { type: "integer", value: 0 }, // $in:0
          { type: "integer", value: context.allocBus.returnValues[0].index },
          { type: "integer", value: 1 }, // $in:1
          { type: "integer", value: context.allocBus.returnValues[1].index },
          { type: "integer", value: 2 }, // $out:0
          { type: "integer", value: 0 },
          { type: "integer", value: 3 }, // $out:1
          { type: "integer", value: 0 },
        ]
      } ]);
    });

    it("should send s_new command to server (apply params[])", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);
      const node0 = new NeuNode(context, 1000);
      const node1 = new NeuSynth(context, inst, [ [ 880, 882 ], 0.5 ], 1003, node0, "addToTail");

      assert.deepEqual(context.sendOSC.args[1], [ {
        address: "/s_new",
        args: [
          { type: "string" , value: inst.sdefName },
          { type: "integer", value: node1.nodeId },
          { type: "integer", value: 1 },
          { type: "integer", value: node0.nodeId },
          { type: "integer", value: 4 }, // freq
          [
            { type: "float"  , value: 880 },
            { type: "float"  , value: 882 },
          ],
          { type: "integer", value: 6 }, // volume
          { type: "float"  , value: 0.5 },
          { type: "integer", value: 0 }, // $in:0
          { type: "integer", value: context.allocBus.returnValues[0].index },
          { type: "integer", value: 1 }, // $in:1
          { type: "integer", value: context.allocBus.returnValues[1].index },
          { type: "integer", value: 2 }, // $out:0
          { type: "integer", value: 0 },
          { type: "integer", value: 3 }, // $out:1
          { type: "integer", value: 0 },
        ]
      } ]);
    });

    it("should send s_new command to server (apply params)", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);
      const node0 = new NeuNode(context, 1000);
      const node1 = new NeuSynth(context, inst, {
        $in: [ 2, 10 ], $out: [ 0, 20 ], freq: [ 880, 882 ], volume: 0.5
      }, 1003, node0, "addToHead");

      assert.deepEqual(context.sendOSC.args[1], [ {
        address: "/s_new",
        args:[
          { type: "string" , value: inst.sdefName },
          { type: "integer", value: node1.nodeId },
          { type: "integer", value: 0 },
          { type: "integer", value: node0.nodeId },
          { type: "integer", value: 4 }, // freq
          [
            { type: "float"  , value: 880 },
            { type: "float"  , value: 882 },
          ],
          { type: "integer", value: 6 }, // volume
          { type: "float"  , value: 0.5 },
          { type: "integer", value: 0 }, // $in:0
          { type: "integer", value: 2 },
          { type: "integer", value: 1 }, // $in:1
          { type: "integer", value: 10 },
          { type: "integer", value: 2 }, // $out:0
          { type: "integer", value: 0 },
          { type: "integer", value: 3 }, // $out:1
          { type: "integer", value: 20 },
        ]
      } ]);
    });

    it("should send s_new command to server (apply bus params)", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);
      const busFreq = context.abus(2);
      const busVolume = context.cbus(1);
      const node0 = new NeuNode(context, 1000);
      const node1 = new NeuSynth(context, inst, {
        freq: busFreq, volume: busVolume,
      }, 1001, node0, "addToHead");

      assert.deepEqual(context.sendOSC.args[1], [ {
        address: "/s_new",
        args: [
          { type: "string" , value: inst.sdefName },
          { type: "integer", value: node1.nodeId },
          { type: "integer", value: 0 },
          { type: "integer", value: node0.nodeId },

          { type: "integer", value: 4 }, // freq
          { type: "string" , value: "a" + busFreq.index },
          { type: "integer", value: 6 }, // volume
          { type: "string" , value: "c" + busVolume.index },

          { type: "integer", value: 0 }, // $in:0
          { type: "integer", value: context.allocBus.returnValues[2].index },
          { type: "integer", value: 1 }, // $in:1
          { type: "integer", value: context.allocBus.returnValues[3].index },
          { type: "integer", value: 2 }, // $out:0
          { type: "integer", value: 0 },
          { type: "integer", value: 3 }, // $out:1
          { type: "integer", value: 0 },
        ]
      } ]);
    });

    it("should send s_new command to server (apply bus)", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);
      const node0 = new NeuNode(context, 1000);
      const node1 = new NeuSynth(context, inst, {}, 1001, node0, "addToHead");
      const node2 = new NeuSynth(context, inst, {}, 1002, node0, "addToHead");

      context.sendOSC.reset();

      const node3 = new NeuSynth(context, inst, {
        $in: node1, $out: node2
      }, 1003, node0, "addToHead");

      assert.deepEqual(context.sendOSC.args[0], [ {
        address: "/s_new",
        args:[
          { type: "string" , value: inst.sdefName },
          { type: "integer", value: node3.nodeId },
          { type: "integer", value: 0 },
          { type: "integer", value: node0.nodeId },
          { type: "integer", value: 0 }, // $in:0
          { type: "integer", value: node1.outputs(0).index },
          { type: "integer", value: 1 }, // $in:1
          { type: "integer", value: node1.outputs(1).index },
          { type: "integer", value: 2 }, // $out:0
          { type: "integer", value: node2.inputs(0).index },
          { type: "integer", value: 3 }, // $out:1
          { type: "integer", value: node2.inputs(1).index },
        ]
      } ]);
    });

    it("should send s_new command to server (apply inst params)", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const node0 = new NeuNode(context, 1000);
      const inst = new NeuInstrument(context, sdef, {
        $in: [ 2, 10 ], $out: [ 0, 20 ], freq: [ 880, 882 ], volume: 0.5
      }, node0, "addToTail");
      const node1 = new NeuSynth(context, inst, {
        volume: 0.25
      }, 1003);

      assert.deepEqual(context.sendOSC.args[1], [ {
        address: "/s_new",
        args:[
          { type: "string" , value: inst.sdefName },
          { type: "integer", value: node1.nodeId },
          { type: "integer", value: 1 },
          { type: "integer", value: node0.nodeId },
          { type: "integer", value: 4 }, // freq
          [
            { type: "float"  , value: 880 },
            { type: "float"  , value: 882 },
          ],
          { type: "integer", value: 6 }, // volume
          { type: "float"  , value: 0.25 },
          { type: "integer", value: 0 }, // $in:0
          { type: "integer", value: 2 },
          { type: "integer", value: 1 }, // $in:1
          { type: "integer", value: 10 },
          { type: "integer", value: 2 }, // $out:0
          { type: "integer", value: 0 },
          { type: "integer", value: 3 }, // $out:1
          { type: "integer", value: 20 },
        ]
      } ]);
    });

    it("should throw Error when given invalid paramters", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);

      assert.throws(() => {
        return new NeuSynth(context, inst, {
          freq: 880, volume: [ 0.5, 0.25 ]
        });
      }, TypeError);
    });
  });

  describe(".ctlNames", () => {
    it("should be array of control names", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);
      const node = new NeuSynth(context, inst, {}, 1001);

      assert.deepEqual(node.ctlNames, inst.ctlNames);
    });
  });

  describe(".numberOfInputs", () => {
    it("should be number of inputs", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);
      const node = new NeuSynth(context, inst, {}, 1001);

      assert(node.numberOfInputs === inst.numberOfInputs);
    });
  });

  describe(".numberOfOutputs", () => {
    it("should be number of outputs", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);
      const node = new NeuSynth(context, inst, {}, 1001);

      assert(node.numberOfOutputs === inst.numberOfOutputs);
    });
  });

  describe(".inputs(n)", () => {
    it("should return input object", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);
      const node = new NeuSynth(context, inst, {}, 1001);

      assert.deepEqual(node.inputs(0), context.allocBus.returnValues[0]);
      assert.deepEqual(node.inputs(1), context.allocBus.returnValues[1]);
    });

    it("should return null when out range of channels", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);
      const node = new NeuSynth(context, inst, {}, 1001);

      assert(node.inputs(100) === null);
    });
  });

  describe(".outputs(n)", () => {
    it("should return output object", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);
      const node = new NeuSynth(context, inst, {}, 1001);

      assert.deepEqual(node.outputs(0), new NeuBus(context, AUDIO  , 0, 2));
      assert.deepEqual(node.outputs(1), new NeuBus(context, CONTROL, 0, 1));
    });

    it("should return null when out range of channels", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);
      const node = new NeuSynth(context, inst, {}, 1001);

      assert(node.outputs(100) === null);
    });
  });

  describe("/n_go", () => {
    it("should emit created", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);
      const node = new NeuSynth(context, inst, {}, 1001);
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();
      const spy3 = sinon.spy();

      node.on("created", spy1);
      inst.on("node-created", spy2);
      sdef.on("node-created", spy3);
      context.apiEmit = sinon.spy(context.apiEmit.bind(context));

      node["/n_go"]();

      assert.deepEqual(spy1.args[0], [ node ]);
      assert.deepEqual(spy2.args[0], [ node ]);
      assert.deepEqual(spy3.args[0], [ node ]);
      assert.deepEqual(context.apiEmit.args[0], [ "node-created", node ]);
    });
  });

  describe("/n_end", () => {
    it("should emit disposed", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);
      const node = new NeuSynth(context, inst, {}, 1001);
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();
      const spy3 = sinon.spy();

      node.on("disposed", spy1);
      inst.on("node-disposed", spy2);
      sdef.on("node-disposed", spy3);
      context.apiEmit = sinon.spy(context.apiEmit.bind(context));

      node["/n_end"]();

      assert.deepEqual(spy1.args[0], [ node ]);
      assert.deepEqual(spy2.args[0], [ node ]);
      assert.deepEqual(spy3.args[0], [ node ]);
      assert.deepEqual(context.apiEmit.args[0], [ "node-disposed", node ]);
    });

    it("should call context.freeBus() each input bus", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);
      const node = new NeuSynth(context, inst, {}, 1001);

      node["/n_end"]();

      assert(context.freeBus.callCount === node.numberOfInputs);
      assert.deepEqual(context.freeBus.args[0], [ node.inputs(0) ]);
      assert.deepEqual(context.freeBus.args[1], [ node.inputs(1) ]);
    });

    it("should call sdef.free() when temporary synth", () => {
      const context = new TestContext();
      const tempSDefJSON = Object.assign({}, sdefJSON, { name: "@@temp" });
      const sdef = new NeuSDef(context, tempSDefJSON);
      const inst = new NeuInstrument(context, sdef);
      const node = new NeuSynth(context, inst, {}, 1001);

      sdef.free = sinon.spy(sdef.free.bind(sdef));

      node["/n_end"]();

      assert(sdef.free.callCount === 1);
    });
  });

  describe("/n_off", () => {
    it("should emit statechanged", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);
      const node = new NeuSynth(context, inst, {}, 1001);
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();
      const spy3 = sinon.spy();

      node.on("statechanged", spy1);
      inst.on("node-statechanged", spy2);
      sdef.on("node-statechanged", spy3);
      context.apiEmit = sinon.spy(context.apiEmit.bind(context));

      node["/n_off"]();

      assert.deepEqual(spy1.args[0], [ node ]);
      assert.deepEqual(spy2.args[0], [ node ]);
      assert.deepEqual(spy3.args[0], [ node ]);
      assert.deepEqual(context.apiEmit.args[0], [ "node-statechanged", node ]);
    });
  });

  describe("/n_on", () => {
    it("should emit statechanged", () => {
      const context = new TestContext();
      const sdef = new NeuSDef(context, sdefJSON);
      const inst = new NeuInstrument(context, sdef);
      const node = new NeuSynth(context, inst, {}, 1001);
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();
      const spy3 = sinon.spy();

      node.on("statechanged", spy1);
      inst.on("node-statechanged", spy2);
      sdef.on("node-statechanged", spy3);
      context.apiEmit = sinon.spy(context.apiEmit.bind(context));

      node["/n_on"]();

      assert.deepEqual(spy1.args[0], [ node ]);
      assert.deepEqual(spy2.args[0], [ node ]);
      assert.deepEqual(spy3.args[0], [ node ]);
      assert.deepEqual(context.apiEmit.args[0], [ "node-statechanged", node ]);
    });
  });
});

describe("neume/node/NeuSynth/bindArgs(context, args)", () => {
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

  it("(inst)", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefJSON);
    const inst = new NeuInstrument(context, sdef);
    const args = bindArgs(context, [ inst ]);

    assert.deepEqual(args, [
      context,
      inst,
      {},
      context.nextNodeId.returnValues[0],
      null,
      null,
    ]);
  });

  it("(inst, params)", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefJSON);
    const inst = new NeuInstrument(context, sdef);
    const args = bindArgs(context, [ inst, { freq: 440 } ]);

    assert.deepEqual(args, [
      context,
      inst,
      { freq: 440 },
      context.nextNodeId.returnValues[0],
      null,
      null,
    ]);
  });

  it("(inst, nodeId)", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefJSON);
    const inst = new NeuInstrument(context, sdef);
    const args = bindArgs(context, [ inst, 1001 ]);

    assert.deepEqual(args, [
      context,
      inst,
      {},
      1001,
      null,
      null,
    ]);
  });

  it("(inst, target)", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefJSON);
    const inst = new NeuInstrument(context, sdef);
    const node = new NeuNode(context, 1000);
    const args = bindArgs(context, [ inst, node ]);

    assert.deepEqual(args, [
      context,
      inst,
      {},
      context.nextNodeId.returnValues[0],
      node,
      null,
    ]);
  });

  it("(inst, params, nodeId)", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefJSON);
    const inst = new NeuInstrument(context, sdef);
    const args = bindArgs(context, [ inst, { freq: 440 }, 1001 ]);

    assert.deepEqual(args, [
      context,
      inst,
      { freq: 440 },
      1001,
      null,
      null,
    ]);
  });

  it("(inst, params, target)", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefJSON);
    const inst = new NeuInstrument(context, sdef);
    const node = new NeuNode(context, 1000);
    const args = bindArgs(context, [ inst, { freq: 440 }, node ]);

    assert.deepEqual(args, [
      context,
      inst,
      { freq: 440 },
      context.nextNodeId.returnValues[0],
      node,
      null,
    ]);
  });

  it("(inst, nodeId, target)", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefJSON);
    const inst = new NeuInstrument(context, sdef);
    const node = new NeuNode(context, 1000);
    const args = bindArgs(context, [ inst, 1001, node ]);

    assert.deepEqual(args, [
      context,
      inst,
      {},
      1001,
      node,
      null,
    ]);
  });

  it("(inst, action, target)", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefJSON);
    const inst = new NeuInstrument(context, sdef);
    const node = new NeuNode(context, 1000);
    const args = bindArgs(context, [ inst, node, "addToTail" ]);

    assert.deepEqual(args, [
      context,
      inst,
      {},
      context.nextNodeId.returnValues[0],
      node,
      "addToTail",
    ]);
  });

  // (inst, params, nodeId, target)
  it("(inst, params, nodeId, target)", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefJSON);
    const inst = new NeuInstrument(context, sdef);
    const node = new NeuNode(context, 1000);
    const args = bindArgs(context, [ inst, { freq: 440 }, 1001, node ]);

    assert.deepEqual(args, [
      context,
      inst,
      { freq: 440 },
      1001,
      node,
      null,
    ]);
  });

  it("(inst, params, target)", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefJSON);
    const inst = new NeuInstrument(context, sdef);
    const node = new NeuNode(context, 1000);
    const args = bindArgs(context, [ inst, { freq: 440 }, node, "addToTail" ]);

    assert.deepEqual(args, [
      context,
      inst,
      { freq: 440 },
      context.nextNodeId.returnValues[0],
      node,
      "addToTail",
    ]);
  });

  it("(inst, nodeId, action, target)", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefJSON);
    const inst = new NeuInstrument(context, sdef);
    const node = new NeuNode(context, 1000);
    const args = bindArgs(context, [ inst, 1001, node, "addToTail" ]);

    assert.deepEqual(args, [
      context,
      inst,
      {},
      1001,
      node,
      "addToTail",
    ]);
  });

  it("(inst, params, nodeId, action, target)", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefJSON);
    const inst = new NeuInstrument(context, sdef);
    const node = new NeuNode(context, 1000);
    const args = bindArgs(context, [ inst, { freq: 440 }, 1001, node, "addToTail" ]);

    assert.deepEqual(args, [
      context,
      inst,
      { freq: 440 },
      1001,
      node,
      "addToTail",
    ]);
  });

  it("(inst: string)", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefJSON);
    const inst = new NeuInstrument(context, sdef);
    const args = bindArgs(context, [ inst.sdefName ]);

    assert.deepEqual(args, [
      context,
      inst,
      {},
      context.nextNodeId.returnValues[0],
      null,
      null,
    ]);
  });

  it("(inst: function)", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, Object.assign({}, sdefJSON, { name: "@@" + sdefJSON.name }));
    const inst = new NeuInstrument(context, sdef);
    const args = bindArgs(context, [ function temp(freq = 440, { SinOsc }) {
      return SinOsc.ar(freq);
    } ]);

    assert.deepEqual(args, [
      context,
      inst,
      {},
      context.nextNodeId.returnValues[0],
      null,
      null,
    ]);
  });

  it("(inst: json)", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, Object.assign({}, sdefJSON, { name: "@@" + sdefJSON.name }));
    const inst = new NeuInstrument(context, sdef);
    const args = bindArgs(context, [ sdefJSON ]);

    assert.deepEqual(args, [
      context,
      inst,
      {},
      context.nextNodeId.returnValues[0],
      null,
      null,
    ]);
  });

  it("(inst: sdef)", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefJSON);
    const inst = new NeuInstrument(context, sdef);
    const args = bindArgs(context, [ sdef ]);

    assert.deepEqual(args, [
      context,
      inst,
      {},
      context.nextNodeId.returnValues[0],
      null,
      null,
    ]);
  });

  it("else case should throw TypeError", () => {
    const context = new TestContext();
    const sdef = new NeuSDef(context, sdefJSON);
    const inst = new NeuInstrument(context, sdef);

    assert.throws(() => {
      bindArgs(context, []);
    }, TypeError);

    assert.throws(() => {
      bindArgs(context, [ null ]);
    }, TypeError);

    assert.throws(() => {
      bindArgs(context, [ inst, null ]);
    }, TypeError);

    assert.throws(() => {
      bindArgs(context, [ inst, null, null ]);
    }, TypeError);

    assert.throws(() => {
      bindArgs(context, [ inst, null, null, null ]);
    }, TypeError);

    assert.throws(() => {
      bindArgs(context, [ inst, null, null, null, null ]);
    }, TypeError);
  });
});
