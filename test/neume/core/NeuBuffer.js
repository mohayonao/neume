import assert from "assert";
import sinon from "sinon";
import { EventEmitter } from "events";
import NeuContext from "../../../src/neume/core/NeuContext";
import NeuBuffer from "../../../src/neume/core/NeuBuffer";
import { bindArgs } from "../../../src/neume/core/NeuBuffer";
import * as commands from "../../../src/scsynth/commands";

class TestServer extends EventEmitter {
  constructor() {
    super();
    this.commands = commands;
    this.sendOSC = sinon.spy();
    this.allocBuffer = sinon.spy();
    this.loadBuffer = sinon.spy();
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

describe("neume/core/NeuBuffer", () => {
  describe("create(context, ...args)", () => {
    it("should create NeuBuffer instance", () => {
      const context = new TestContext();
      const buffer = NeuBuffer.create(context, 1, 128);

      assert(buffer instanceof NeuBuffer);
      assert(buffer.context === context);
    });
  });

  describe("constructor(context, bufId, numberOfChannels, length, source)", () => {
    it("should create NeuBuffer instance", () => {
      const context = new TestContext();
      const buffer = new NeuBuffer(context, 0, 1, 128, null);

      assert(buffer instanceof NeuBuffer);
      assert(buffer.bufId === 0);
      assert(buffer.numberOfChannels === 1);
      assert(buffer.length === 128);
      assert(buffer.source === null);
    });

    it("should call context.allocBuffer()", () => {
      const context = new TestContext();
      const buffer = new NeuBuffer(context, 0, 1, 128, null);

      assert(context.allocBuffer.callCount === 1);
      assert.deepEqual(context.allocBuffer.args[0].slice(0, 3), [
        buffer.bufId, buffer.numberOfChannels, buffer.length
      ]);
      assert(typeof context.allocBuffer.args[0][3] === "function");
    });

    it("should call context.loadBuffer() when given source", () => {
      const context = new TestContext();
      const buffer = new NeuBuffer(context, 0, 0, 0, "/path/to/source");

      assert(context.loadBuffer.callCount === 1);
      assert.deepEqual(context.loadBuffer.args[0].slice(0, 2), [
        buffer.bufId, buffer.source
      ]);
      assert(typeof context.loadBuffer.args[0][2] === "function");
    });

    it("should receive buffer info from callback", () => {
      const context = new TestContext();
      const buffer = new NeuBuffer(context, 0, 0, 0, "/path/to/source");

      context.loadBuffer.args[0][2]({
        numberOfChannels: 2, length: 1024, sampleRate: 22050,
      });

      assert(buffer.numberOfChannels === 2);
      assert(buffer.length === 1024);
      assert(buffer.sampleRate === 22050);
    });

    it("should emit buffer-created event when created", () => {
      const context = new TestContext();
      const buffer = new NeuBuffer(context, 0, 0, 0, "/path/to/source");
      const spy1 = sinon.spy();

      buffer.on("created", spy1);
      context.apiEmit = sinon.spy(context.apiEmit.bind(context));

      context.loadBuffer.args[0][2]({
        numberOfChannels: 2, length: 1024, sampleRate: 22050,
      });

      assert.deepEqual(spy1.args[0], [ buffer ]);
      assert.deepEqual(context.apiEmit.args[0], [ "buffer-created", buffer ]);
    });
  });

  describe(".state", () => {
    it("should be buffer state", () => {
      const context = new TestContext();
      const buffer = new NeuBuffer(context, 0, 0, 0, "/path/to/source");

      assert(buffer.state === "loading");

      context.loadBuffer.args[0][2]({
        numberOfChannels: 2, length: 1024, sampleRate: 22050,
      });

      assert(buffer.state === "loaded");

      buffer.free();

      assert(buffer.state === "disposed");
    });
  });

  describe(".free()", () => {
    it("should send b_free command to server", () => {
      const context = new TestContext();
      const buffer = new NeuBuffer(context, 0, 1, 128, null);

      buffer.free();

      assert.deepEqual(context.sendOSC.args[0][0], {
        address: "/b_free",
        args: [
          { type: "integer", value: buffer.bufId },
        ]
      });
    });

    it("should emit buffer-disposed event when diposed", () => {
      const context = new TestContext();
      const buffer = new NeuBuffer(context, 0, 1, 128, null);
      const spy1 = sinon.spy();

      buffer.on("disposed", spy1);
      context.apiEmit = sinon.spy(context.apiEmit.bind(context));

      buffer.free();

      context.sendOSC.args[0][1](); // done dispose

      assert.deepEqual(spy1.args[0], [ buffer ]);
      assert.deepEqual(context.apiEmit.args[0], [ "buffer-disposed", buffer ]);
    });
  });

  describe(".toSCNodeInput()", () => {
    it("should be bufId", () => {
      const context = new TestContext();
      const buffer = new NeuBuffer(context, 0, 1, 128, null);

      assert(buffer.toSCNodeInput() === buffer.bufId);
    });
  });
});

describe("neume/core/NeuBuffer/bindArgs(context, args)", () => {
  it("(source)", () => {
    const context = new TestContext();
    const args = bindArgs(context, [ "/path/to/source" ]);

    assert.deepEqual(args, [
      context,
      context.nextBufId.returnValues[0],
      0,
      0,
      "/path/to/source",
    ]);
  });

  it("(length)", () => {
    const context = new TestContext();
    const args = bindArgs(context, [ 128 ]);

    assert.deepEqual(args, [
      context,
      context.nextBufId.returnValues[0],
      1,
      128,
      null,
    ]);
  });

  it("(bufId, source)", () => {
    const context = new TestContext();
    const args = bindArgs(context, [ 1, "/path/to/source" ]);

    assert.deepEqual(args, [
      context,
      1,
      0,
      0,
      "/path/to/source",
    ]);
  });

  it("(numberOfChannels, length)", () => {
    const context = new TestContext();
    const args = bindArgs(context, [ 2, 128 ]);

    assert.deepEqual(args, [
      context,
      context.nextBufId.returnValues[0],
      2,
      128,
      null,
    ]);
  });

  it("(bufId, numberOfChannels, length)", () => {
    const context = new TestContext();
    const args = bindArgs(context, [ 1, 2, 128 ]);

    assert.deepEqual(args, [
      context,
      1,
      2,
      128,
      null,
    ]);
  });

  it("else case shoud throw TypeError", () => {
    const context = new TestContext();

    assert.throws(() => {
      bindArgs(context, []);
    }, TypeError);

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
