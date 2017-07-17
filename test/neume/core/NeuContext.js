import assert from "assert";
import sinon from "sinon";
import { EventEmitter } from "events";
import NeuContext from "../../../src/neume/core/NeuContext";
import NeuBuffer from "../../../src/neume/core/NeuBuffer";
import NeuBus from "../../../src/neume/core/NeuBus";
import NeuSDef from "../../../src/neume/inst/NeuSDef";
import NeuInstrument from "../../../src/neume/inst/NeuInstrument";
import NeuNode from "../../../src/neume/node/NeuNode";
import NeuGroup from "../../../src/neume/node/NeuGroup";
import NeuSynth from "../../../src/neume/node/NeuSynth";
import NeuCPS from "../../../src/neume/sched/NeuCPS";
import NeuCyclic from "../../../src/neume/sched/NeuCyclic";
import { AUDIO, CONTROL } from "../../../src/neume/constants";
import * as commands from "../../../src/scsynth/commands";

class TestServer extends EventEmitter {
  constructor() {
    super();
    this.commands = commands;
    this.sendOSC = sinon.spy();
    this.sendOSCAt = sinon.spy();
    this.allocBuffer = sinon.spy();
  }
}

describe("neume/core/NeuContext", () => {
  describe("constructor(opts)", () => {
    it("should create NeuContext", () => {
      const context = new NeuContext({ ServerClass: TestServer });

      assert(context instanceof NeuContext);
      assert(context.server instanceof TestServer);
    });

    it("should send g_new command for root node", () => {
      const context = new NeuContext({ ServerClass: TestServer });

      assert.deepEqual(context.server.sendOSC.args[0], [ {
        timetag: [ 0, 1 ],
        elements: [
          {
            address: "/notify",
            args: [
              { type: "integer", value: 1 }
            ]
          },
          {
            address: "/dumpOSC",
            args: [
              { type: "integer", value: 1 }
            ]
          },
          {
            address: "/clearSched"
          },
          {
            address: "/g_new",
            args: [
              { type: "integer", value: context.rootNode.nodeId },
              { type: "integer", value: 0 },
              { type: "integer", value: 0 },
            ]
          },
          {
            address: "/g_freeAll",
            args: [ { type: "integer", value: context.rootNode.nodeId } ]
          }
        ]
      } ]);
    });
  });

  describe(".createAPI()", () => {
    it("should create context api", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const api = context.createAPI();

      assert(typeof api === "object");
    });
  });

  describe(".now()", () => {
    it("should return timeline playback time", () => {
      const context = new NeuContext({ ServerClass: TestServer });

      assert(context.now() === context._.timeline.playbackTime);
    });
  });

  describe(".sched(...args)", () => {
    it("should call timeline.sched()", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const fn = sinon.spy();

      context._.timeline.sched = sinon.spy();

      context.sched(1, fn, 10, 20);

      assert.deepEqual(context._.timeline.sched.args[0], [
        1, fn, 10, 20
      ]);
    });
  });

  describe(".schedRel(...args)", () => {
    it("should call timeline.sched()", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const fn = sinon.spy();

      context._.timeline.sched = sinon.spy();

      context.schedRel(1, fn, 10, 20);

      assert.deepEqual(context._.timeline.sched.args[0], [
        context.now() + 1, fn, 10, 20
      ]);
    });
  });

  describe(".unsched(schedId)", () => {
    it("should call timeline.unsched()", () => {
      const context = new NeuContext({ ServerClass: TestServer });

      context._.timeline.unsched = sinon.spy();

      context.unsched(1);

      assert.deepEqual(context._.timeline.unsched.args[0], [
        1
      ]);
    });
  });

  describe(".unschedAll()", () => {
    it("should send clear sched command to timeline and server", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const callback = sinon.spy();

      context.sendOSC = sinon.spy();
      context._.timeline.unschedAll = sinon.spy();

      context.unschedAll(callback);

      assert(context._.timeline.unschedAll.callCount === 1);
      assert.deepEqual(context.sendOSC.args[0], [ {
        address: "/clearSched"
      }, callback ]);
    });
  });

  describe(".abus(length)", () => {
    it("should call context.allocBus(AUDIO)", () => {
      const context = new NeuContext({ ServerClass: TestServer });

      context.allocBus = sinon.spy(context.allocBus.bind(context));

      const bus = context.abus(1);

      assert.deepEqual(context.allocBus.args[0], [ AUDIO, 1 ]);
      assert(bus instanceof NeuBus);
    });
  });

  describe(".cbus(length)", () => {
    it("should call context.allocBus(CONTROL)", () => {
      const context = new NeuContext({ ServerClass: TestServer });

      context.allocBus = sinon.spy(context.allocBus.bind(context));

      const bus = context.cbus(1);

      assert.deepEqual(context.allocBus.args[0], [ CONTROL, 1 ]);
      assert(bus instanceof NeuBus);
    });
  });

  describe(".reset()", () => {
    it("should send reset command to timeline and server", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const callback = sinon.spy();

      context.sendOSC = sinon.spy();
      context._.timeline.unschedAll = sinon.spy();

      context.reset(callback);

      assert(context._.timeline.unschedAll.callCount === 1);
      assert.deepEqual(context.sendOSC.args[0], [ {
        timetag: [ 0, 1 ], // immediate
        elements: [
          {
            address: "/clearSched"
          },
          {
            address: "/g_freeAll",
            args: [ { type: "integer", value: context.rootNode.nodeId } ]
          }
        ]
      }, callback ]);
    });
  });

  describe(".buffer(...args)", () => {
    it("should create NeuBuffer instance", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const buffer = context.buffer(1024);

      assert(buffer instanceof NeuBuffer);
    });
  });

  describe(".sdef(...args)", () => {
    it("should create NeuSDef instance", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const sdef = context.sdef({ name: "@@temp", consts: [], units: [] });

      assert(sdef instanceof NeuSDef);
    });
  });

  describe(".inst(...args)", () => {
    it("should create NeuInstrument instance", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const inst = context.inst({ name: "@@temp", consts: [], units: [] });

      assert(inst instanceof NeuInstrument);
    });
  });

  describe(".group(...args)", () => {
    it("should create NeuGroup instance", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const node = context.group(1000);

      assert(node instanceof NeuGroup);
    });
  });

  describe(".synth(...args)", () => {
    it("should create NeuGroup instance", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const node = context.synth({ name: "@@temp", consts: [], units: [] });

      assert(node instanceof NeuSynth);
    });
  });

  describe(".cps(...args)", () => {
    it("should create NeuCPS instance", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const cps = context.cps(1);

      assert(cps instanceof NeuCPS);
    });
  });

  describe(".cyclic(...args)", () => {
    it("should create NeuCPS instance", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const cps = context.cps(1);
      const cyclic = context.cyclic(cps, []);

      assert(cyclic instanceof NeuCyclic);
    });
  });

  describe(".nextNodeId()", () => {
    it("should generate node id", () => {
      const context = new NeuContext({ ServerClass: TestServer });

      assert(typeof context.nextNodeId() === "number");
      assert(context.nextNodeId() !== context.nextNodeId());
    });
  });

  describe(".nextBufId()", () => {
    it("should generate buffer id", () => {
      const context = new NeuContext({ ServerClass: TestServer });

      assert(typeof context.nextBufId() === "number");
      assert(context.nextBufId() !== context.nextBufId());
    });
  });

  describe(".allocBuffer(bufId, numberOfChannels, length, callback)", () => {
    it("should call server.allocBuffer()", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const callback = sinon.spy();

      context.server.allocBuffer = sinon.spy();

      context.allocBuffer(0, 1, 128, callback);

      assert.deepEqual(context.server.allocBuffer.args[0], [
        0, 1, 128, callback
      ]);
    });
  });

  describe(".loadBuffer(bufId, source, callback)", () => {
    it("should call server.allocBuffer()", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const callback = sinon.spy();

      context.server.loadBuffer = sinon.spy();

      context.loadBuffer(0, "/path/to/source", callback);

      assert.deepEqual(context.server.loadBuffer.args[0], [
        0, "/path/to/source", callback
      ]);
    });
  });

  describe(".allocBus(rate, length)", () => {
    it("should allocate Audio Bus", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const bus = context.allocBus(AUDIO, 2);

      assert(bus instanceof NeuBus);
      assert(bus.rate === AUDIO);
    });

    it("should allocate Control Bus", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const bus = context.allocBus(CONTROL, 2);

      assert(bus instanceof NeuBus);
      assert(bus.rate === CONTROL);
    });
  });

  describe(".freeBus(bus)", () => {
    it("should allocate Audio Bus", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const bus = context.allocBus(AUDIO, 2);

      context.freeBus(bus);
    });

    it("should allocate Control Bus", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const bus = context.allocBus(CONTROL, 2);

      context.freeBus(bus);
    });
  });

  describe(".sendOSC(...args)", () => {
    it("should call server.sendOSC()", () => {
      const context = new NeuContext({ ServerClass: TestServer });

      context.server.sendOSC.reset();
      context.sendOSC({ address: "/foo" });

      assert.deepEqual(context.server.sendOSC.args[0], [ {
        address: "/foo"
      } ]);
    });

    it("should call .sendOSCAt() if sched mode", () => {
      const context = new NeuContext({ ServerClass: TestServer });

      context.sendOSCAt = sinon.spy();

      context.beginSched();
      context.sendOSC({ address: "/foo" });
      context.endSched();

      assert.deepEqual(context.sendOSCAt.args[0], [
        context.now(), { address: "/foo" }
      ]);
    });
  });

  describe(".sendOSCAt(when, ...args)", () => {
    it("should call server.sendOSCAt()", () => {
      const context = new NeuContext({ ServerClass: TestServer });

      context.server.sendOSCAt.reset();
      context.sendOSCAt(0, { address: "/foo" });

      assert.deepEqual(context.server.sendOSCAt.args[0], [ 0, {
        address: "/foo"
      } ]);
    });
  });

  describe("register sdef", () => {
    it("works", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const sdef = { name: "temp", consts: [], units: [] };
      const inst = new NeuSDef(context, sdef);

      context.registerSDef(inst);

      assert(context.getSDefByName(inst.name) === inst);

      context.unregisterSDef(inst);

      assert(context.getSDefByName(inst.name) === null);
    });
  });

  describe("register node", () => {
    it("works", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const node = new NeuNode(context, 1000);

      context.registerNode(node);

      assert(context.getNodeByNodeId(node.nodeId) === node);

      context.unregisterNode(node);

      assert(context.getNodeByNodeId(node.nodeId) === null);
    });
  });

  describe("receive osc message", () => {
    it(".n_cmd(msg)", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const node = new NeuNode(context, 1000);
      const msg = { address: "/n_info", args: [ 1000, 0, -1, -1, 0 ] };

      node["/n_info"] = sinon.spy();

      context.registerNode(node);
      context.n_cmd(msg);

      assert.deepEqual(node["/n_info"].args[0], [ msg ]);
    });

    it("/n_go", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const msg = { address: "/n_go" };

      context.n_cmd = sinon.spy();
      context.server.emit("recvOSC", msg);

      assert.deepEqual(context.n_cmd.args[0], [ msg ]);
    });

    it("/n_end", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const msg = { address: "/n_end" };

      context.n_cmd = sinon.spy();
      context.server.emit("recvOSC", msg);

      assert.deepEqual(context.n_cmd.args[0], [ msg ]);
    });

    it("/n_off", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const msg = { address: "/n_off" };

      context.n_cmd = sinon.spy();
      context.server.emit("recvOSC", msg);

      assert.deepEqual(context.n_cmd.args[0], [ msg ]);
    });

    it("/n_on", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const msg = { address: "/n_on" };

      context.n_cmd = sinon.spy();
      context.server.emit("recvOSC", msg);

      assert.deepEqual(context.n_cmd.args[0], [ msg ]);
    });

    it("/n_move", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const msg = { address: "/n_move" };

      context.n_cmd = sinon.spy();
      context.server.emit("recvOSC", msg);

      assert.deepEqual(context.n_cmd.args[0], [ msg ]);
    });

    it("/n_info", () => {
      const context = new NeuContext({ ServerClass: TestServer });
      const msg = { address: "/n_info" };

      context.n_cmd = sinon.spy();
      context.server.emit("recvOSC", msg);

      assert.deepEqual(context.n_cmd.args[0], [ msg ]);
    });
  });
});
