import NeuBusAllocator from "../core/NeuBusAllocator";
import NeuObject from "../core//NeuObject";
import NeuBuffer from "../core/NeuBuffer";
import NeuSDef from "../inst/NeuSDef";
import NeuInstrument from "../inst/NeuInstrument";
import NeuGroup from "../node/NeuGroup";
import NeuSynth from "../node/NeuSynth";
import NeuTimeline from "../sched/NeuTimeline";
import NeuMetro from "../sched/NeuMetro";
import NeuCPS from "../sched/NeuCPS";
import NeuCyclic from "../sched/NeuCyclic";
import { AUDIO, CONTROL } from "../constants";
import defaults from "../utils/defaults";

export default class NeuContext extends NeuObject {
  constructor(opts) {
    super(null);

    this.context = this;
    this.server = new opts.ServerClass(opts);
    this.server.on("recvOSC", (msg) => {
      /* istanbul ignore else */
      if (typeof this[msg.address] == "function") {
        this[msg.address](msg);
      }
      this.apiEmit("recvOSC", msg);
    });
    this.commands = this.server.commands;
    this.sampleRate = defaults(opts.sampleRate, 44100);
    this.rootNode = { nodeId: 1000 };

    this._.timeline = new NeuTimeline(this);
    this._.nextNodeId = this.rootNode.nodeId + 1;
    this._.nextBufId = 128;
    this._.sendOSCAt = false;
    this._.aBusAlloc = new NeuBusAllocator(this, AUDIO  ,  1024, 128);
    this._.cBusAlloc = new NeuBusAllocator(this, CONTROL, 16384, 128);
    this._.sdefMap = new Map();
    this._.nodeMap = new Map();

    this.sendOSC({
      timetag: [ 0, 1 ],
      elements: [
        this.commands.notify(1),
        this.commands.dumpOSC(1),
        this.commands.clearSched(),
        this.commands.g_new(this.rootNode.nodeId),
        this.commands.g_freeAll(this.rootNode.nodeId),
      ]
    });
  }

  createAPI() {
    return [
      "now",
      "sched", "schedRel", "unsched", "unschedAll",
      "abus", "cbus", "reset",
      "buffer", "sdef", "inst",
      "group", "synth",
      "metro", "cps", "cyclic",
    ].reduce((api, name) => {
      return (api[name] = this[name].bind(this), api);
    }, {});
  }

  now() {
    return this._.timeline.playbackTime;
  }

  sched(time, callback, ...args) {
    return this._.timeline.sched(time, callback, ...args);
  }

  schedRel(delta, callback, ...args) {
    return this._.timeline.sched(this.now() + delta, callback, ...args);
  }

  unsched(schedId) {
    return this._.timeline.unsched(schedId);
  }

  unschedAll(callback) {
    this._.timeline.unschedAll();
    this.sendOSC(this.commands.clearSched(), callback);
  }

  abus(length) {
    return this.allocBus(AUDIO, length);
  }

  cbus(length) {
    return this.allocBus(CONTROL, length);
  }

  reset(callback) {
    this._.timeline.unschedAll();
    this.sendOSC({
      timetag: [ 0, 1 ],
      elements: [
        this.commands.clearSched(),
        this.commands.g_freeAll(this.rootNode.nodeId),
      ]
    }, callback);
  }

  buffer(...args) {
    return NeuBuffer.create(this, ...args);
  }

  sdef(...args) {
    return NeuSDef.create(this, ...args);
  }

  inst(...args) {
    return NeuInstrument.create(this, ...args);
  }

  group(...args) {
    return NeuGroup.create(this, ...args);
  }

  synth(...args) {
    return NeuSynth.create(this, ...args);
  }

  metro(...args) {
    return NeuMetro.create(this, ...args);
  }

  cps(...args) {
    return NeuCPS.create(this, ...args);
  }

  cyclic(...args) {
    return NeuCyclic.create(this, ...args);
  }

  // internal api

  nextNodeId() {
    return this._.nextNodeId++;
  }

  nextBufId() {
    return this._.nextBufId++;
  }

  allocBuffer(bufId, numberOfChannels, length, callback) {
    this.server.allocBuffer(bufId, numberOfChannels, length, callback);
  }

  loadBuffer(bufId, source, callback) {
    this.server.loadBuffer(bufId, source, callback);
  }

  allocBus(rate, length) {
    if (rate === AUDIO) {
      return this._.aBusAlloc.alloc(length);
    }
    return this._.cBusAlloc.alloc(length);
  }

  freeBus(bus) {
    if (bus.rate === AUDIO) {
      return this._.aBusAlloc.free(bus);
    }
    return this._.cBusAlloc.free(bus);
  }

  sendOSC(...args) {
    if (this._.sendOSCAt) {
      this.sendOSCAt(this.now(), ...args);
    } else {
      this.server.sendOSC(...args);
    }
  }

  sendOSCAt(when, ...args) {
    this.server.sendOSCAt(when, ...args);
  }

  beginSched() {
    this._.sendOSCAt = true;
  }

  endSched() {
    this._.sendOSCAt = false;
  }

  registerSDef(sdef) {
    this._.sdefMap.set(sdef.name, sdef);
  }

  unregisterSDef(sdef) {
    this._.sdefMap.delete(sdef.name);
  }

  getSDefByName(name) {
    return this._.sdefMap.get(name) || null;
  }

  registerNode(node) {
    this._.nodeMap.set(node.nodeId, node);
  }

  unregisterNode(node) {
    this._.nodeMap.delete(node.nodeId);
  }

  getNodeByNodeId(nodeId) {
    return this._.nodeMap.get(nodeId) || null;
  }

  apiEmit(event, payload) {
    this.emit("api-emit", { event, payload });
  }

  n_cmd(msg) {
    const node = this.getNodeByNodeId(msg.args[0]);

    /* istanbul ignore else */
    if (node && typeof node[msg.address] === "function") {
      node[msg.address](msg);
    }
  }

  ["/n_go"](msg) {
    this.n_cmd(msg);
  }

  ["/n_end"](msg) {
    this.n_cmd(msg);
  }

  ["/n_off"](msg) {
    this.n_cmd(msg);
  }

  ["/n_on"](msg) {
    this.n_cmd(msg);
  }

  ["/n_move"](msg) {
    this.n_cmd(msg);
  }

  ["/n_info"](msg) {
    this.n_cmd(msg);
  }
}
