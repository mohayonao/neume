import NeuBus from "../core/NeuBus";
import NeuSDef from "../inst/NeuSDef";
import NeuInstrument from "../inst/NeuInstrument";
import NeuNode from "../node/NeuNode";
import isPlainObject from "../utils/isPlainObject";
import isSDefJSON from "../utils/isSDefJSON";
import sdefBuild from "../utils/sdefBuild";
import sdefName from "../utils/sdefName";
import toAddAction from "../utils/toAddAction";
import toNodeId from "../utils/toNodeId";
import { prependDRecvIfNeeded } from "../inst/NeuSDef";
import { AUDIO } from "../constants";

export default class NeuSynth extends NeuNode {
  static create(context, ...args) {
    return new NeuSynth(...bindArgs(context, args));
  }

  constructor(context, inst, params, nodeId, target, action) {
    super(context, nodeId);

    if (Array.isArray(params)) {
      params = toParams(params, inst);
    }
    params = Object.assign({}, inst.params, params);

    target = target != null ? target : inst.target != null ? inst.target : context.rootNode;
    action = action != null ? action : inst.action != null ? inst.action : "addToHead";

    this.inst = inst;
    this.isSynth = true;

    const targetId = toNodeId(target);
    const addAction = toAddAction(action);
    const ctls = buildOSCParamsCtl(context, inst, params);
    const inputs = buildOSCParamsIn(context, inst, params);
    const outputs = buildOSCParamsOut(context, inst, params);

    this._.inputs = Array.from({ length: inst.numberOfInputs }, (_, i) => {
      const { rate, length } = inst.inputs(i);
      const index = inputs[i * 2 + 1].value;

      return new NeuBus(context, rate, index, length);
    });
    this._.outputs = Array.from({ length: inst.numberOfOutputs }, (_, i) => {
      const { rate, length } = inst.outputs(i);
      const index = outputs[i * 2 + 1].value;

      return new NeuBus(context, rate, index, length);
    });

    const cmd = prependDRecvIfNeeded(inst.sdef, context.commands.s_new(
      inst.sdefName, this.nodeId, addAction, targetId, ...ctls, ...inputs, ...outputs
    ));

    context.sendOSC(cmd);
  }

  get ctlNames() {
    return this.inst.ctlNames;
  }

  get numberOfInputs() {
    return this._.inputs.length;
  }

  get numberOfOutputs() {
    return this._.outputs.length;
  }

  inputs(n) {
    return this._.inputs[n] || null;
  }

  outputs(n) {
    return this._.outputs[n] || null;
  }
}

export function bindArgs(context, args) {
  args[0] = toInst(context, args[0]);

  if (args[0] instanceof NeuInstrument) {
    switch (args.length) {
    case 1:
      // (inst)
      return [ context, args[0], {}, context.nextNodeId(), null, null ];
    case 2:
      // (inst, params)
      if (isParams(args[1])) {
        return [ context, args[0], args[1], context.nextNodeId(), null, null ];
      }
      // (inst, nodeId)
      if (typeof args[1] === "number") {
        return [ context, args[0], {}, args[1], null, null ];
      }
      // (inst, target)
      if (args[1] instanceof NeuNode) {
        return [ context, args[0], {}, context.nextNodeId(), args[1], null ];
      }
      break;
    case 3:
      // (inst, params, nodeId)
      if (isParams(args[1]) && typeof args[2] === "number") {
        return [ context, args[0], args[1], args[2], null, null ];
      }
      // (inst, params, target)
      if (isParams(args[1]) && args[2] instanceof NeuNode) {
        return [ context, args[0], args[1], context.nextNodeId(), args[2], null ];
      }
      // (inst, nodeId, target)
      if (typeof args[1] === "number" && args[2] instanceof NeuNode) {
        return [ context, args[0], {}, args[1], args[2], null ];
      }
      // (inst, target, action)
      if (args[1] instanceof NeuNode && typeof args[2] === "string") {
        return [ context, args[0], {}, context.nextNodeId(), args[1], args[2] ];
      }
      break;
    case 4:
      // (inst, params, nodeId, target)
      if (isParams(args[1]) && typeof args[2] === "number" && args[3] instanceof NeuNode) {
        return [ context, args[0], args[1], args[2], args[3], null ];
      }
      // (inst, params, target, action)
      if (isParams(args[1]) && args[2] instanceof NeuNode && typeof args[3] === "string") {
        return [ context, args[0], args[1], context.nextNodeId(), args[2], args[3] ];
      }
      // (inst, nodeId, target, action)
      if (typeof args[1] === "number" && args[2] instanceof NeuNode && typeof args[3] === "string") {
        return [ context, args[0], {}, args[1], args[2], args[3] ];
      }
      break;
    case 5:
      // (inst, params, nodeId, target, action)
      if (isParams(args[1]) && typeof args[2] === "number" && args[3] instanceof NeuNode && typeof args[4] === "string") {
        return [ context, args[0], args[1], args[2], args[3], args[4] ];
      }
      break;
    }
  }
  throw TypeError(`
    Provided parameters for Synth constructor is invalid.
  `.trim());
}

function isParams(value) {
  return isPlainObject(value) || Array.isArray(value);
}

function toParams(values, inst) {
  const ctlNames = inst.ctlNames;

  return values.reduce((params, value, index) => {
    return (params[ctlNames[index]] = value, params);
  }, {});
}

function toInst(context, inst) {
  if (typeof inst === "string") {
    inst = context.getSDefByName(inst);
  }
  if (typeof inst === "function") {
    inst = new NeuSDef(context, sdefBuild("@@" + sdefName(inst), inst), { noRegister: true });
  }
  if (isSDefJSON(inst)) {
    inst = Object.assign({}, inst, { name: `@@${ inst.name }` });
    inst = new NeuSDef(context, inst, { noRegister: true });
  }
  if (inst instanceof NeuSDef) {
    inst = new NeuInstrument(context, inst);
  }
  return inst;
}

function buildOSCParamsCtl(context, inst, params) {
  const cmdParams = [];
  const ctlNames = inst.ctlNames;

  ctlNames.filter(name => params.hasOwnProperty(name)).forEach((name) => {
    const { index, length } = inst.ctls(name);

    if (params[name] instanceof NeuBus) {
      const bus = params[name];

      if (bus.rate === AUDIO) {
        cmdParams.push(index, "a" + bus.index);
      } else {
        cmdParams.push(index, "c" + bus.index);
      }
    } else {
      const values = toArray(params[name]);

      if (values.length !== length) {
        throw new TypeError(`
          ctl['${ name }'] require ${ length } items, but got ${ values.length } items.
        `.trim());
      }

      if (values.length === 1) {
        cmdParams.push(index, values[0]);
      } else {
        cmdParams.push(index, values);
      }
    }
  });

  return cmdParams;
}

function buildOSCParamsIn(context, inst, params) {
  const cmdParams = [];
  const numberOfInputs = inst.numberOfInputs;
  const inputs = toArray(params["$in"]);
  const inSynth = inputs.length === 1 && inputs[0] instanceof NeuSynth;

  Array.from({ length: numberOfInputs }, (_, i) => {
    const { rate, index, length } = inst.inputs(i);
    const in_ = inSynth ? inputs[0].outputs(i) : inputs[i];

    let busIndex;

    if (in_ == null) {
      busIndex = context.allocBus(rate, length).index;
    } else if (in_ instanceof NeuBus) {
      busIndex = getBus(in_, "input", i, rate, length);
    } else {
      busIndex = toBus(in_);
    }

    cmdParams.push(index, { type: "integer", value: busIndex });
  });

  return cmdParams;
}

function buildOSCParamsOut(context, inst, params) {
  const cmdParams = [];
  const numberOfOutputs = inst.numberOfOutputs;
  const outputs = toArray(params["$out"]);
  const inSynth = outputs.length === 1 && outputs[0] instanceof NeuSynth;

  let nextOutAR = 0;
  let nextOutKR = 0;

  Array.from({ length: numberOfOutputs }, (_, i) => {
    const { rate, index, length } = inst.outputs(i);
    const out = inSynth ? outputs[0].inputs(i) : outputs[i];

    let busIndex;

    if (out == null) {
      busIndex = rate === AUDIO ? nextOutAR : nextOutKR;
    } else if (out instanceof NeuBus) {
      busIndex = getBus(out, "output", i, rate, length);
    } else {
      busIndex = toBus(out);
    }

    cmdParams.push(index, { type: "integer", value: busIndex });

    if (rate === AUDIO) {
      nextOutAR = busIndex + length;
    } else {
      nextOutKR = busIndex + length;
    }
  });

  return cmdParams;
}

/* istanbul ignore next */
function toArray(value) {
  return value == null ? [] : Array.isArray(value) ? value : [ value ];
}

/* istanbul ignore next */
function getBus(value, type, index, rate, length) {
  if (value.rate !== rate) {
    throw new TypeError(`
      ${ type }s[${ index }] require ${ toStrRate(rate) } rate, but got ${ toStrRate(value.rate) } rate.
    `.trim());
  }
  if (value.length !== length) {
    throw new TypeError(`
      ${ type }s[${ index }] require ${ length } channels, but got ${ value.length } channels.
    `.trim());
  }
  return value.index;
}

/* istanbul ignore next */
function toBus(value) {
  if (typeof value === "number") {
    return value|0;
  }
  return 0;
}

/* istanbul ignore next */
function toStrRate(value) {
  return [ "scalar", "control", "audio", "demand" ][value] || "unknown";
}
