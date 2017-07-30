import NeuNode from "../node/NeuNode";
import toAddAction from "../utils/toAddAction";
import toNodeId from "../utils/toNodeId";

export default class NeuGroup extends NeuNode {
  static create(context, ...args) {
    return new NeuGroup(...bindArgs(context, args));
  }

  constructor(context, nodeId, target, action) {
    super(context, nodeId);

    this.isGroup = true;

    const targetId = toNodeId(target);
    const addAction = toAddAction(action);
    const cmd = context.commands.g_new(nodeId, addAction, targetId);

    context.sendOSC(cmd);
  }

  freeAll() {
    const { context } = this;
    const cmd = context.commands.g_freeAll(this.nodeId);

    context.sendOSC(cmd);
    context.unregisterNode(this);

    this._.state = "disposed";

    return this;
  }

  deepFree() {
    const { context } = this;
    const cmd = context.commands.g_deepFree(this.nodeId);

    context.sendOSC(cmd);
    context.unregisterNode(this);

    this._.state = "disposed";

    return this;
  }
}

export function bindArgs(context, args) {
  switch (args.length) {
  case 0:
    return [ context, context.nextNodeId(), context.rootNode, "addToHead" ];
  case 1:
    // (nodeId)
    if (typeof args[0] === "number") {
      return [ context, args[0], context.rootNode, "addToHead" ];
    }
    // (target)
    if (args[0] instanceof NeuNode) {
      return [ context, context.nextNodeId(), args[0], "addToHead" ];
    }
    break;
  case 2:
    // (nodeId, target)
    if (typeof args[0] === "number" && args[1] instanceof NeuNode) {
      return [ context, args[0], args[1], "addToHead" ];
    }
    // (target, action)
    if (args[0] instanceof NeuNode && typeof args[1] === "string") {
      return [ context, context.nextNodeId(), args[0], args[1] ];
    }
    break;
  case 3:
    // (nodeId, target, action)
    if (typeof args[0] === "number" && args[1] instanceof NeuNode && typeof args[2] === "string") {
      return [ context, args[0], args[1], args[2] ];
    }
    break;
  }
  throw TypeError(`
    Provided parameters for Group constructor is invalid.
  `.trim());
}
