import assert from "assert";
import sinon from "sinon";
import { EventEmitter } from "events";
import NeuContext from "../../../src/neume/core/NeuContext";
import NeuBus from "../../../src/neume/core/NeuBus";
import { AUDIO, CONTROL } from "../../../src/neume/constants";
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

describe("neume/core/NeuBus", () => {
  describe("constructor(context, rate, index, length)", () => {
    it("should create NeuBus instance", () => {
      const context = new TestContext();
      const bus = new NeuBus(context, AUDIO, 0, 2);

      assert(bus instanceof NeuBus);
      assert(bus.rate === AUDIO);
      assert(bus.index === 0);
      assert(bus.length === 2);
    });
  });

  describe(".in", () => {
    it("should create In.ar", () => {
      const context = new TestContext();
      const bus = new NeuBus(context, AUDIO, 0, 2);
      const node = bus.in;

      assert(Array.isArray(node) && node.length === 2);
      assert(node[0].type === "OutputProxy");
      assert(node[0].rate === "audio");
      assert(node[0].props[0].type === "In");
    });

    it("should create In.kr", () => {
      const context = new TestContext();
      const bus = new NeuBus(context, CONTROL, 0, 2);
      const node = bus.in;

      assert(Array.isArray(node) && node.length === 2);
      assert(node[0].type === "OutputProxy");
      assert(node[0].rate === "control");
      assert(node[0].props[0].type === "In");
    });
  });

  describe(".value", () => {
    it("should call .set() when set", () => {
      const context = new TestContext();
      const bus = new NeuBus(context, CONTROL, 0, 2);

      bus.set = sinon.spy();

      bus.value = 1;

      assert(bus.set.args[0], [ 1 ]);
    });
  });

  describe(".set(value)", () => {
    it("should send c_set command to server", () => {
      const context = new TestContext();
      const bus = new NeuBus(context, CONTROL, 0, 2);

      bus.set(1);

      assert.deepEqual(context.sendOSC.args[0], [ {
        address: "/c_set",
        args: [
          { type: "integer", value: bus.index },
          { type: "float"  , value: 1 },
        ]
      } ]);
    });

    it("should throw Error when rate is AUDIO", () => {
      const context = new TestContext();
      const bus = new NeuBus(context, AUDIO, 0, 2);

      assert.throws(() => {
        bus.set(1);
      }, TypeError);
    });
  });

  describe(".setAt(index, value)", () => {
    it("should send c_set command to server", () => {
      const context = new TestContext();
      const bus = new NeuBus(context, CONTROL, 0, 2);

      bus.setAt(1, 2);

      assert.deepEqual(context.sendOSC.args[0], [ {
        address: "/c_set",
        args: [
          { type: "integer", value: bus.index + 1 },
          { type: "float"  , value: 2 },
        ]
      } ]);
    });

    it("should throw Error when index is out of range", () => {
      const context = new TestContext();
      const bus = new NeuBus(context, CONTROL, 0, 2);

      assert.throws(() => {
        bus.setAt(10, 2);
      }, TypeError);
    });

    it("should throw Error when rate is AUDIO", () => {
      const context = new TestContext();
      const bus = new NeuBus(context, AUDIO, 0, 2);

      assert.throws(() => {
        bus.setAt(1, 2);
      }, TypeError);
    });
  });
});
