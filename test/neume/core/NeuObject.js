import assert from "assert";
import sinon from "sinon";
import NeuObject from "../../../src/neume/core/NeuObject";

describe("neume/core/NeuObject", () => {
  describe("constructor(context)", () => {
    it("should create NeuObject instance", () => {
      const context = {};
      const obj = new NeuObject(context);

      assert(obj instanceof NeuObject);
      assert(obj.context === context);
    });
  });

  describe(".on(eventName, listener)", () => {
    it("should call emitter.on()", () => {
      const context = {};
      const obj = new NeuObject(context);
      const listener = sinon.spy();

      obj._.emitter.on = sinon.spy();

      obj.on("foo", listener);

      assert.deepEqual(obj._.emitter.on.args[0], [
        "foo", listener
      ]);
    });
  });

  describe(".once(eventName, listener)", () => {
    it("should call emitter.once()", () => {
      const context = {};
      const obj = new NeuObject(context);
      const listener = sinon.spy();

      obj._.emitter.once = sinon.spy();

      obj.once("foo", listener);

      assert.deepEqual(obj._.emitter.once.args[0], [
        "foo", listener
      ]);
    });
  });

  describe(".addListener(eventName, listener)", () => {
    it("should call emitter.addListener()", () => {
      const context = {};
      const obj = new NeuObject(context);
      const listener = sinon.spy();

      obj._.emitter.addListener = sinon.spy();

      obj.addListener("foo", listener);

      assert.deepEqual(obj._.emitter.addListener.args[0], [
        "foo", listener
      ]);
    });
  });

  describe(".removeListener(eventName, listener)", () => {
    it("should call emitter.removeListener()", () => {
      const context = {};
      const obj = new NeuObject(context);
      const listener = sinon.spy();

      obj._.emitter.removeListener = sinon.spy();

      obj.removeListener("foo", listener);

      assert.deepEqual(obj._.emitter.removeListener.args[0], [
        "foo", listener
      ]);
    });
  });

  describe(".removeAllListeners(eventName)", () => {
    it("should call emitter.removeAllListeners()", () => {
      const context = {};
      const obj = new NeuObject(context);

      obj._.emitter.removeAllListeners = sinon.spy();

      obj.removeAllListeners("foo");

      assert.deepEqual(obj._.emitter.removeAllListeners.args[0], [
        "foo"
      ]);
    });
  });

  describe(".emit(eventName, ...args)", () => {
    it("should call emitter.emit()", () => {
      const context = {};
      const obj = new NeuObject(context);

      obj._.emitter.emit = sinon.spy();

      obj.emit("foo", 1, 2, 3);

      assert.deepEqual(obj._.emitter.emit.args[0], [
        "foo", 1, 2, 3
      ]);
    });
  });
});
