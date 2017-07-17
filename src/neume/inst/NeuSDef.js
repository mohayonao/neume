import NeuObject from "../core/NeuObject";
import isPlainObject from "../utils/isPlainObject";
import isSDefJSON from "../utils/isSDefJSON";
import sdefAnalyze from "../utils/sdefAnalyze";
import sdefBuild from "../utils/sdefBuild";
import sdefName from "../utils/sdefName";

export default class NeuSDef extends NeuObject {
  static create(context, ...args) {
    return new NeuSDef(...bindArgs(context, args));
  }

  constructor(context, sdef, opts = {}) {
    super(context);

    this.sdef = sdef;

    const meta = sdefAnalyze(sdef);

    this._.ctls = meta.ctls;
    this._.inputs = meta.inputs;
    this._.outputs = meta.outputs;
    this._.sendFlag = false;
    this._.doneDRecv = false;

    if (sdef.paramIndices) {
      this._.ctlNames = sdef.paramIndices.map(({ name }) => name).filter((name) => {
        return meta.ctls.hasOwnProperty(name);
      });
    } else {
      this._.ctlNames = [];
    }

    if (!opts.noSend) {
      this.send();
    }

    // not reigster when created by neu.synth(buildFn)
    if (!(opts.noRegister || sdef.name.startsWith("@@"))) {
      context.registerSDef(this);
    }
  }

  get name() {
    return this.sdef.name;
  }

  get ctlNames() {
    return this._.ctlNames;
  }

  get numberOfInputs() {
    return this._.inputs.length;
  }

  get numberOfOutputs() {
    return this._.outputs.length;
  }

  ctls(name) {
    return this._.ctls[name] || null;
  }

  inputs(n) {
    return this._.inputs[n|0] || null;
  }

  outputs(n) {
    return this._.outputs[n|0] || null;
  }

  free() {
    const { context } = this;
    const cmd = context.commands.d_free(this.name);

    context.sendOSC(cmd);
    context.unregisterSDef(this);

    return this;
  }

  send() {
    const { context } = this;

    if (!this._.sendFlag) {
      context.sendOSC(context.commands.d_recv(this.sdef), () => {
        this._.doneDRecv = true;
      });
      this._.sendFlag = true;
    }

    return this;
  }
}

export function prependDRecvIfNeeded(inst, cmd) {
  if (inst._.doneDRecv) {
    return cmd;
  }
  return inst.context.commands.d_recv(inst.sdef, cmd);
}

export function bindArgs(context, args) {
  switch (args.length) {
  case 1:
    // (sdef)
    if (isSDefJSON(args[0])) {
      return [ context, args[0], {} ];
    }
    // (buildFn)
    if (typeof args[0] === "function") {
      return bindArgs(context, [ sdefBuild(sdefName(args[0]), args[0]) ]);
    }
    break;
  case 2:
    // (sdef, opts)
    if (isSDefJSON(args[0]) && isPlainObject(args[1])) {
      return [ context, args[0], args[1] ];
    }
    // (name, buildFn)
    if (typeof args[0] === "string" && typeof args[1] === "function") {
      return bindArgs(context, [ sdefBuild(args[0], args[1]) ]);
    }
    // (buildFn, fnArgs)
    if (typeof args[0] === "function" && Array.isArray(args[1])) {
      return bindArgs(context, [ sdefBuild(sdefName(args[0]), args[0], args[1]) ]);
    }
    // (buildFn, opts)
    if (typeof args[0] === "function" && isPlainObject(args[1])) {
      return bindArgs(context, [ sdefBuild(sdefName(args[0]), args[0]), args[1] ]);
    }
    break;
  case 3:
    // (name, buildFn, fnArgs)
    if (typeof args[0] === "string" && typeof args[1] === "function" && Array.isArray(args[2])) {
      return bindArgs(context, [ sdefBuild(args[0], args[1], args[2]) ]);
    }
    // (name, buildFn, opts)
    if (typeof args[0] === "string" && typeof args[1] === "function" && isPlainObject(args[2])) {
      return bindArgs(context, [ sdefBuild(args[0], args[1]), args[2] ]);
    }
    break;
  case 4:
    // (name, buildFn, fnArgs, opts)
    if (typeof args[0] === "string" && typeof args[1] === "function" && Array.isArray(args[2]) && isPlainObject(args[3])) {
      return bindArgs(context, [ sdefBuild(args[0], args[1], args[2]), args[3] ]);
    }
    break;
  }
  throw TypeError(`
    Provided parameters for SDef constructor is invalid.
  `.trim());
}
