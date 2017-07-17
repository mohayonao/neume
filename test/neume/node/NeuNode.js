import assert from "assert";
import sinon from "sinon";
import { EventEmitter } from "events";
import NeuContext from "../../../src/neume/core/NeuContext";
import NeuNode from "../../../src/neume/node/NeuNode";
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
  }
}

describe("neume/node/NeuNode", () => {
  describe("constructor(context, nodeId)", () => {
    it("should create NeuNode instance", () => {
      const context = new TestContext();
      const node = new NeuNode(context, 1000);

      assert(node instanceof NeuNode);
      assert(node.nodeId === 1000);
    });
  });

  describe(".state", () => {
    it("should be node state", () => {
      const context = new TestContext();
      const node = new NeuNode(context, 1000);

      assert(node.state === "creating");

      node["/n_go"]();

      assert(node.state === "running");

      node["/n_off"]();

      assert(node.state === "suspended");

      node["/n_end"]();

      assert(node.state === "disposed");
    });
  });

  describe(".free()", () => {
    it("should send n_free command to server", () => {
      const context = new TestContext();
      const node = new NeuNode(context, 1000);

      node.free();

      assert.deepEqual(context.sendOSC.args[0], [ {
        address: "/n_free",
        args: [
          { type: "integer", value: node.nodeId },
        ]
      } ]);
    });
  });

  describe(".run()", () => {
    it("should send n_run [ nodeId, 1 ] command to server", () => {
      const context = new TestContext();
      const node = new NeuNode(context, 1000);

      node.run();

      assert.deepEqual(context.sendOSC.args[0], [ {
        address: "/n_run",
        args: [
          { type: "integer", value: node.nodeId },
          { type: "integer", value: 1 },
        ]
      } ]);
    });
  });

  describe(".run(runFlag)", () => {
    it("should send n_run command to server", () => {
      const context = new TestContext();
      const node = new NeuNode(context, 1000);

      node.run(0);

      assert.deepEqual(context.sendOSC.args[0], [ {
        address: "/n_run",
        args: [
          { type: "integer", value: node.nodeId },
          { type: "integer", value: 0 },
        ]
      } ]);
    });
  });

  describe(".apply(params)", () => {
    it("should send n_set command to server", () => {
      const context = new TestContext();
      const node = new NeuNode(context, 1000);

      node.apply({ freq: [ 440, 442 ], volume: 0.2 });

      assert.deepEqual(context.sendOSC.args[0], [ {
        address: "/n_set",
        args: [
          { type: "integer", value: node.nodeId },
          { type: "string" , value: "freq" },
          [
            { type: "float"  , value: 440 },
            { type: "float"  , value: 442 },
          ],
          { type: "string" , value: "volume" },
          { type: "float"  , value: 0.2 },
        ]
      } ]);
    });

    it("should send n_map command to server when given cbus", () => {
      const context = new TestContext();
      const node = new NeuNode(context, 1000);
      const bus = context.cbus(1);

      node.apply({ freq: bus });

      assert.deepEqual(context.sendOSC.args[0], [ {
        address: "/n_map",
        args: [
          { type: "integer", value: node.nodeId },
          { type: "string" , value: "freq" },
          { type: "integer", value: bus.index },
        ]
      } ]);
    });

    it("should send n_mapa command to server when given abus", () => {
      const context = new TestContext();
      const node = new NeuNode(context, 1000);
      const bus = context.abus(1);

      node.apply({ freq: bus });

      assert.deepEqual(context.sendOSC.args[0], [ {
        address: "/n_mapa",
        args: [
          { type: "integer", value: node.nodeId },
          { type: "string" , value: "freq" },
          { type: "integer", value: bus.index },
        ]
      } ]);
    });

    it("should send osc bundle to server when given param and bus", () => {
      const context = new TestContext();
      const node = new NeuNode(context, 1000);
      const bus = context.cbus(1);

      node.apply({ freq: bus, volume: 0.2 });

      assert.deepEqual(context.sendOSC.args[0], [ {
        timetag: [ 0, 1 ],
        elements: [
          {
            address: "/n_set",
            args: [
              { type: "integer", value: node.nodeId },
              { type: "string" , value: "volume" },
              { type: "float", value: 0.2 },
            ]
          },
          {
            address: "/n_map",
            args: [
              { type: "integer", value: node.nodeId },
              { type: "string" , value: "freq" },
              { type: "integer", value: bus.index },
            ]
          }
        ]
      } ]);
    });

    it("should proxy to call .set(params)", () => {
      const context = new TestContext();
      const node = new NeuNode(context, 1000);

      node.apply = sinon.spy();

      node.ctl.freq = 440;

      assert(node.apply.args[0], [ { freq: 440 } ]);
    });
  });

  describe(".release()", () => {
    it("should send n_set [ nodeId, \\gate, 0 ] command to server", () => {
      const context = new TestContext();
      const node = new NeuNode(context, 1000);

      node.release();

      assert.deepEqual(context.sendOSC.args[0], [ {
        address: "/n_set",
        args: [
          { type: "integer", value: node.nodeId },
          { type: "string" , value: "gate" },
          { type: "float"  , value: 0 },
        ]
      } ]);
    });
  });

  describe(".release(releaseTime)", () => {
    it("should send n_set [ nodeId, \\gate, gateTime ] command to server", () => {
      const context = new TestContext();
      const node = new NeuNode(context, 1000);

      node.release(1);

      assert.deepEqual(context.sendOSC.args[0], [ {
        address: "/n_set",
        args: [
          { type: "integer", value: node.nodeId },
          { type: "string" , value: "gate" },
          { type: "float"  , value: -2 },
        ]
      } ]);
    });
  });

  describe("/n_go", () => {
    it("should emit created", () => {
      const context = new TestContext();
      const node = new NeuNode(context, 1000);
      const spy = sinon.spy();

      node.on("created", spy);
      context.apiEmit = sinon.spy(context.apiEmit.bind(context));

      node["/n_go"]();

      assert.deepEqual(spy.args[0], [ node ]);
      assert.deepEqual(context.apiEmit.args[0], [ "node-created", node ]);
    });
  });

  describe("/n_end", () => {
    it("should emit disposed", () => {
      const context = new TestContext();
      const node = new NeuNode(context, 1000);
      const spy = sinon.spy();

      node.on("disposed", spy);
      context.apiEmit = sinon.spy(context.apiEmit.bind(context));

      node["/n_end"]();

      assert.deepEqual(spy.args[0], [ node ]);
      assert.deepEqual(context.apiEmit.args[0], [ "node-disposed", node ]);
    });
  });

  describe("/n_off", () => {
    it("should emit statechanged", () => {
      const context = new TestContext();
      const node = new NeuNode(context, 1000);
      const spy = sinon.spy();

      node.on("statechanged", spy);
      context.apiEmit = sinon.spy(context.apiEmit.bind(context));

      node["/n_off"]();

      assert.deepEqual(spy.args[0], [ node ]);
      assert.deepEqual(context.apiEmit.args[0], [ "node-statechanged", node ]);
    });
  });

  describe("/n_on", () => {
    it("should emit statechanged", () => {
      const context = new TestContext();
      const node = new NeuNode(context, 1000);
      const spy = sinon.spy();

      node.on("statechanged", spy);
      context.apiEmit = sinon.spy(context.apiEmit.bind(context));

      node["/n_on"]();

      assert.deepEqual(spy.args[0], [ node ]);
      assert.deepEqual(context.apiEmit.args[0], [ "node-statechanged", node ]);
    });
  });
});
