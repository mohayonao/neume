import assert from "assert";
import sinon from "sinon";
import { EventEmitter } from "events";
import NeuContext from "../../../src/neume/core/NeuContext";
import NeuNode from "../../../src/neume/node/NeuNode";
import NeuGroup from "../../../src/neume/node/NeuGroup";
import { bindArgs } from "../../../src/neume/node/NeuGroup";
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

describe("neume/node/NeuGroup", () => {
  describe("create(context, ...args)", () => {
    it("should create NeuGroup instance", () => {
      const context = new TestContext();
      const node = NeuGroup.create(context);

      assert(node instanceof NeuGroup);
      assert(node.context === context);
    });
  });

  describe("constructor(context, nodeId, target, action)", () => {
    it("should create NeuGroup instance", () => {
      const context = new TestContext();
      const node = new NeuGroup(context, 1001);

      assert(node instanceof NeuGroup);
      assert(node instanceof NeuNode);
      assert(node.context === context);
      assert(node.nodeId === 1001);
    });

    it("should send g_new command to server", () => {
      const context = new TestContext();
      const node0 = new NeuNode(context, 1000);
      const node1 = new NeuGroup(context, 1001, node0, "addToTail");

      assert.deepEqual(context.sendOSC.args[0], [ {
        address: "/g_new",
        args: [
          { type: "integer", value: node1.nodeId },
          { type: "integer", value: 1 }, // ADD_TO_TAIL
          { type: "integer", value: node0.nodeId },
        ]
      } ]);
    });
  });

  describe(".freeAll()", () => {
    it("should send g_freeAll command to server", () => {
      const context = new TestContext();
      const node = new NeuGroup(context, 1001);

      node.freeAll();

      assert.deepEqual(context.sendOSC.args[1], [ {
        address: "/g_freeAll",
        args: [
          { type: "integer", value: node.nodeId },
        ]
      } ]);
    });
  });

  describe(".deepFree()", () => {
    it("should send g_deepFree command to server", () => {
      const context = new TestContext();
      const node = new NeuGroup(context, 1001);

      node.deepFree();

      assert.deepEqual(context.sendOSC.args[1], [ {
        address: "/g_deepFree",
        args: [
          { type: "integer", value: node.nodeId },
        ]
      } ]);
    });
  });
});

describe("neume/node/NeuGroup/bindArgs(context, args)", () => {
  it("()", () => {
    const context = new TestContext();
    const args = bindArgs(context, []);

    assert.deepEqual(args, [
      context,
      context.nextNodeId.returnValues[0],
      context.rootNode,
      "addToHead",
    ]);
  });

  it("(nodeId)", () => {
    const context = new TestContext();
    const args = bindArgs(context, [ 1001 ]);

    assert.deepEqual(args, [
      context,
      1001,
      context.rootNode,
      "addToHead",
    ]);
  });

  it("(target)", () => {
    const context = new TestContext();
    const node = new NeuNode(context);
    const args = bindArgs(context, [ node ]);

    assert.deepEqual(args, [
      context,
      context.nextNodeId.returnValues[0],
      node,
      "addToHead",
    ]);
  });

  it("(nodeId, target)", () => {
    const context = new TestContext();
    const node = new NeuNode(context);
    const args = bindArgs(context, [ 1001, node ]);

    assert.deepEqual(args, [
      context,
      1001,
      node,
      "addToHead",
    ]);
  });

  it("(target, action)", () => {
    const context = new TestContext();
    const node = new NeuNode(context);
    const args = bindArgs(context, [ node, "addToTail" ]);

    assert.deepEqual(args, [
      context,
      context.nextNodeId.returnValues[0],
      node,
      "addToTail",
    ]);
  });

  it("(nodeId, target, action)", () => {
    const context = new TestContext();
    const node = new NeuNode(context);
    const args = bindArgs(context, [ 1001, node, "addToTail" ]);

    assert.deepEqual(args, [
      context,
      1001,
      node,
      "addToTail",
    ]);
  });

  it("else case should throw TypeError", () => {
    const context = new TestContext();

    assert.throws(() => {
      bindArgs(context, [ null ]);
    }, TypeError);

    assert.throws(() => {
      bindArgs(context, [ null, null ]);
    }, TypeError);

    assert.throws(() => {
      bindArgs(context, [ null, null, null ]);
    }, TypeError);
  });
});
