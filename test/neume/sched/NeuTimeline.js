import assert from "assert";
import sinon from "sinon";
import { EventEmitter } from "events";
import NeuContext from "../../../src/neume/core/NeuContext";
import NeuTimeline from "../../../src/neume/sched/NeuTimeline";
import toOSCTimeTag from "../../../src/scsynth/utils/toOSCTimeTag";
import * as commands from "../../../src/scsynth/commands";

class TestServer extends EventEmitter {
  constructor() {
    super();
    this.commands = commands;
    this.sendOSC = sinon.spy();
    this.sendOSCAt = sinon.spy();
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

function createTimerAPI(timerId) {
  return {
    setInterval: sinon.spy(() => timerId),
    clearInterval: sinon.spy(),
    setTimeout: sinon.spy(() => timerId),
    clearTimeout: sinon.spy(),
  };
}

function createDateAPI(now) {
  return {
    now: sinon.spy(() => now),
    set: value => now = value,
  };
}

describe("neume/core/NeuTimeline", () => {
  describe("constructor(context)", () => {
    it("should create NeuTimeline instance", () => {
      const context = new TestContext();
      const timeline = new NeuTimeline(context);

      assert(timeline instanceof NeuTimeline);
    });
  });

  describe(".state", () => {
    it("should be timeline state", () => {
      const context = new TestContext();
      const timeline = new NeuTimeline(context);

      assert(timeline.state === "suspended");
    });
  });

  describe(".events", () => {
    it("should be timeline events", () => {
      const context = new TestContext();
      const timeline = new NeuTimeline(context);

      assert.deepEqual(timeline.events, []);
    });
  });

  describe(".start()", () => {
    it("should start timer", () => {
      const context = new TestContext();
      const timerAPI = createTimerAPI(1);
      const dateAPI = createDateAPI(1483196400000);
      const timeline = new NeuTimeline(context, { timerAPI, dateAPI });

      timeline.start();

      assert(timeline.state === "running");
      assert(timerAPI.setInterval.callCount === 1);
      assert(timerAPI.setInterval.args[0][1] === timeline.interval * 1000);
      assert(timeline.playbackTime === dateAPI.now() / 1000);

      timeline.start();

      assert(timerAPI.setInterval.callCount === 1);
    });
  });

  describe(".stop()", () => {
    it("should stop timer", () => {
      const context = new TestContext();
      const timerAPI = createTimerAPI(1);
      const dateAPI = createDateAPI(1483196400000);
      const timeline = new NeuTimeline(context, { timerAPI, dateAPI });

      timeline.stop();

      assert(timerAPI.clearInterval.callCount === 0);

      timeline.start();
      timeline.stop();

      assert(timeline.state === "suspended");
      assert(timerAPI.clearInterval.callCount === 1);
      assert(timerAPI.clearInterval.args[0][0] === timerAPI.setInterval.returnValues[0]);
    });
  });

  describe(".sched(time, callback, args)", () => {
    it("should insert event to timeline", () => {
      const context = new TestContext();
      const timerAPI = createTimerAPI(1);
      const dateAPI = createDateAPI(1483196400000);
      const timeline = new NeuTimeline(context, { timerAPI, dateAPI });
      const fn1 = sinon.spy();
      const fn2 = sinon.spy();
      const fn3 = sinon.spy();
      const fn4 = sinon.spy();
      const t0 = dateAPI.now() / 1000;

      const id1 = timeline.sched(t0 + 2, fn1, 10);
      const id2 = timeline.sched(t0 + 1, fn2, 20);
      const id3 = timeline.sched(t0 + 4, fn3, 30);
      const id4 = timeline.sched(t0 + 3, fn4, 40);

      assert.deepEqual(timeline.events[0], {
        id: id2, time: t0 + 1, callback: fn2, args: [ 20 ]
      });
      assert.deepEqual(timeline.events[1], {
        id: id1, time: t0 + 2, callback: fn1, args: [ 10 ]
      });
      assert.deepEqual(timeline.events[2], {
        id: id4, time: t0 + 3, callback: fn4, args: [ 40 ]
      });
      assert.deepEqual(timeline.events[3], {
        id: id3, time: t0 + 4, callback: fn3, args: [ 30 ]
      });
    });
  });

  describe(".unsched(schedId)", () => {
    it("should remove event from timeline", () => {
      const context = new TestContext();
      const timerAPI = createTimerAPI(1);
      const dateAPI = createDateAPI(1483196400000);
      const timeline = new NeuTimeline(context, { timerAPI, dateAPI });
      const fn1 = sinon.spy();
      const fn2 = sinon.spy();
      const fn3 = sinon.spy();
      const fn4 = sinon.spy();
      const t0 = dateAPI.now() / 1000;

      const id1 = timeline.sched(t0 + 2, fn1, 10);
      const id2 = timeline.sched(t0 + 1, fn2, 20);
      const id3 = timeline.sched(t0 + 4, fn3, 30);
      const id4 = timeline.sched(t0 + 3, fn4, 40);

      timeline.unsched(id1);
      timeline.unsched(100);

      assert.deepEqual(timeline.events[0], {
        id: id2, time: t0 + 1, callback: fn2, args: [ 20 ]
      });
      assert.deepEqual(timeline.events[1], {
        id: id4, time: t0 + 3, callback: fn4, args: [ 40 ]
      });
      assert.deepEqual(timeline.events[2], {
        id: id3, time: t0 + 4, callback: fn3, args: [ 30 ]
      });
    });
  });

  describe(".unschedAll()", () => {
    it("should remove all events", () => {
      const context = new TestContext();
      const timerAPI = createTimerAPI(1);
      const dateAPI = createDateAPI(1483196400000);
      const timeline = new NeuTimeline(context, { timerAPI, dateAPI });
      const fn1 = sinon.spy();
      const fn2 = sinon.spy();
      const fn3 = sinon.spy();
      const fn4 = sinon.spy();
      const t0 = dateAPI.now() / 1000;

      timeline.sched(t0 + 2, fn1, 10);
      timeline.sched(t0 + 1, fn2, 20);
      timeline.sched(t0 + 4, fn3, 30);
      timeline.sched(t0 + 3, fn4, 40);

      timeline.unschedAll();

      assert.deepEqual(timeline.events, []);
    });
  });

  describe(".process()", () => {
    it("should process events", () => {
      const context = new TestContext();
      const timerAPI = createTimerAPI(1);
      const dateAPI = createDateAPI(1483196400000);
      const timeline = new NeuTimeline(context, { timerAPI, dateAPI });
      const fn1 = sinon.spy();
      const fn2 = sinon.spy();
      const fn3 = sinon.spy();
      const fn4 = sinon.spy();
      const t0 = dateAPI.now() / 1000;

      timeline.sched(t0 + 2, fn1, 10);
      timeline.sched(t0 + 1, fn2, 20);
      timeline.sched(t0 + 4, fn3, 30);
      timeline.sched(t0 + 3, fn4, 40);

      dateAPI.set((t0 + 0.95) * 1000);
      timeline.process();

      assert(fn2.callCount === 1);
      assert.deepEqual(fn2.args[0], [ 20 ]);
      assert(fn1.callCount === 0);
      assert(fn4.callCount === 0);
      assert(fn3.callCount === 0);

      dateAPI.set((t0 + 2.95) * 1000);
      timeline.process();

      assert(fn2.callCount === 1);
      assert(fn1.callCount === 1);
      assert.deepEqual(fn1.args[0], [ 10 ]);
      assert(fn4.callCount === 1);
      assert.deepEqual(fn4.args[0], [ 40 ]);
      assert(fn3.callCount === 0);
    });

    it("should send sched osc when timeline process", () => {
      const context = new TestContext();
      const timerAPI = createTimerAPI(1);
      const dateAPI = createDateAPI(1483196400000);
      const timeline = new NeuTimeline(context, { timerAPI, dateAPI });
      const fn1 = sinon.spy(() => {
        context.sendOSC({ address: "/foo" });
      });
      const t0 = dateAPI.now() / 1000;

      timeline.sched(t0 + 2, fn1, 10);

      dateAPI.set((t0 + 1.95) * 1000);
      timeline.process();

      assert(fn1.callCount === 1);
      assert(context.sendOSCAt.callCount === 1);
      assert(context.sendOSCAt.args[0], [ {
        timetag: toOSCTimeTag(t0 + 2),
        elements: [ { address: "/foo" } ]
      } ]);
    });
  });
});
