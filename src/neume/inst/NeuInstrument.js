import NeuObject from "../core/NeuObject";
import NeuSDef from "../inst/NeuSDef";
import NeuNode from "../node/NeuNode";
import isPlainObject from "../utils/isPlainObject";
import isSDefJSON from "../utils/isSDefJSON";
import sdefBuild from "../utils/sdefBuild";
import sdefName from "../utils/sdefName";

export default class NeuInstrument extends NeuObject {
  static create(context, ...args) {
    return new NeuInstrument(...bindArgs(context, args));
  }

  constructor(context, sdef, params = null, target = null, action = null) {
    super(context);

    this.sdef = sdef;
    this._.params = params;
    this._.target = target;
    this._.action = action;
  }

  get sdefName() {
    return this.sdef.name;
  }

  get ctlNames() {
    return this.sdef.ctlNames;
  }

  get numberOfInputs() {
    return this.sdef.numberOfInputs;
  }

  get numberOfOutputs() {
    return this.sdef.numberOfOutputs;
  }

  get params() {
    return this._.params;
  }

  get target() {
    return this._.target;
  }

  get action() {
    return this._.action;
  }

  ctls(name) {
    return this.sdef.ctls(name);
  }

  inputs(n) {
    return this.sdef.inputs(n);
  }

  outputs(n) {
    return this.sdef.outputs(n);
  }
}

export function bindArgs(context, args) {
  args[0] = toSDef(context, args[0]);

  if (args[0] instanceof NeuSDef) {
    switch (args.length) {
    case 1:
      // (sdef)
      return [ context, args[0], null, null, null ];
    case 2:
      // (sdef, params)
      if (isPlainObject(args[1])) {
        return [ context, args[0], args[1], null, null ];
      }
      // (sdef, target)
      if (args[1] instanceof NeuNode) {
        return [ context, args[0], null, args[1], null ];
      }
      break;
    case 3:
      // (sdef, params, target)
      if (isPlainObject(args[1]) && args[2] instanceof NeuNode) {
        return [ context, args[0], args[1], args[2], null ];
      }
      // (sdef, target, action)
      if (args[1] instanceof NeuNode && typeof args[2] === "string") {
        return [ context, args[0], null, args[1], args[2] ];
      }
      break;
    case 4:
      // (sdef, params, target, action)
      if (isPlainObject(args[1]) && args[2] instanceof NeuNode && typeof args[3] === "string") {
        return [ context, args[0], args[1], args[2], args[3] ];
      }
      break;
    }
  }
  throw TypeError(`
    Provided parameters for Instrument constructor is invalid.
  `.trim());
}

function toSDef(context, sdef) {
  if (typeof sdef === "string") {
    return context.getSDefByName(sdef);
  }
  if (typeof sdef === "function") {
    return new NeuSDef(context, sdefBuild(sdefName(sdef), sdef));
  }
  if (isSDefJSON(sdef)) {
    return new NeuSDef(context, sdef);
  }
  return sdef;
}
