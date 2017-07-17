import NeuBus from "../core/NeuBus";
import NeuObject from "../core/NeuObject";
import { AUDIO } from "../constants";

export default class NeuNode extends NeuObject {
  constructor(context, nodeId) {
    super(context);

    this.nodeId = nodeId;
    this.isNode = true;
    this.ctl = new Proxy(this, ctlHandler);

    this._.state = "creating";

    context.registerNode(this);
  }

  get state() {
    return this._.state;
  }

  free() {
    const { context } = this;
    const cmd = context.commands.n_free(this.nodeId)

    context.sendOSC(cmd);
    context.unregisterNode(this);

    this._.state = "disposed";

    return this;
  }

  run(runFlag = true) {
    const { context } = this;
    const cmd = context.commands.n_run(this.nodeId, runFlag);

    context.sendOSC(cmd);

    return this;
  }

  apply(params) {
    const { context } = this;
    const xParams = [];
    const cParams = [];
    const aParams = [];

    Object.keys(params).forEach((name) => {
      const param = params[name];

      if (param instanceof NeuBus) {
        if (param.rate === AUDIO) {
          aParams.push(name, param.index);
        } else {
          cParams.push(name, param.index);
        }
      } else {
        xParams.push(name, param);
      }
    });

    const elements = [
      context.commands.n_set(this.nodeId, ...xParams),
      context.commands.n_map(this.nodeId, ...cParams),
      context.commands.n_mapa(this.nodeId, ...aParams),
    ].filter(cmd => cmd.args.length !== 1);

    let cmd;

    if (elements.length === 1) {
      cmd = elements[0];
    } else {
      cmd = { timetag: [ 0, 1 ], elements };
    }

    context.sendOSC(cmd);

    return this;
  }

  release(releaseTime) {
    if (releaseTime == null) {
      releaseTime = 0;
    } else {
      releaseTime = -1 * releaseTime - 1;
    }
    const { context } = this;
    const cmd = context.commands.n_set(this.nodeId, "gate", releaseTime);

    context.sendOSC(cmd);

    return this;
  }

  ["/n_go"]() {
    const { context } = this;

    this._.state = "running";

    this.emit("created", this);
    if (this.inst) {
      this.inst.emit("node-created", this);
      this.inst.sdef.emit("node-created", this);
    }
    context.apiEmit("node-created", this);
  }

  ["/n_end"]() {
    const { context } = this;

    if (this.inst) {
      this._.inputs.forEach((bus) => {
        this.context.freeBus(bus);
      });
      if (this.inst.sdefName.startsWith("@@")) {
        this.inst.sdef.free();
      }
    }

    this._.state = "disposed";
    context.unregisterNode(this);

    this.emit("disposed", this);
    if (this.inst) {
      this.inst.emit("node-disposed", this);
      this.inst.sdef.emit("node-disposed", this);
    }
    context.apiEmit("node-disposed", this);
  }

  ["/n_off"]() {
    const { context } = this;

    this._.state = "suspended";

    this.emit("statechanged", this);
    if (this.inst) {
      this.inst.emit("node-statechanged", this);
      this.inst.sdef.emit("node-statechanged", this);
    }
    context.apiEmit("node-statechanged", this);
  }

  ["/n_on"]() {
    const { context } = this;

    this._.state = "running";

    this.emit("statechanged", this);
    if (this.inst) {
      this.inst.emit("node-statechanged", this);
      this.inst.sdef.emit("node-statechanged", this);
    }
    context.apiEmit("node-statechanged", this);
  }
}

const ctlHandler = {
  set(target, name, value) {
    target.apply({ [name]: value });
    return true;
  }
};
