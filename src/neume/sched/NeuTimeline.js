import NeuObject from "../core/NeuObject";
import defaults from "../utils/defaults";

export default class NeuTimeline extends NeuObject {
  constructor(context, opts = {}) {
    super(context);

    this.playbackTime = 0;
    this.interval = defaults(opts.interval, 0.025);
    this.aheadTime = defaults(opts.aheadTime, 0.1);
    this.timerAPI = defaults(opts.timerAPI, global);
    this.dateAPI = defaults(opts.dateAPI, Date);

    this._.timerId = 0;
    this._.schedId = 0;
    this._.scheds = [];
  }

  get state() {
    return this._.timerId !== 0 ? "running" : "suspended";
  }

  get events() {
    return this._.scheds;
  }

  start() {
    if (this._.timerId === 0) {
      this.playbackTime = this.dateAPI.now() / 1000;
      this._.timerId = this.timerAPI.setInterval(
        this.process.bind(this), this.interval * 1000
      );
    }
    return this;
  }

  stop() {
    if (this._.timerId !== 0) {
      this.timerAPI.clearInterval(this._.timerId);
      this._.timerId = 0;
    }
    return this;
  }

  sched(time, callback, ...args) {
    const id = ++this._.schedId;
    const event = { id, time, callback, args };
    const scheds = this._.scheds;

    if (scheds.length === 0 || scheds[scheds.length - 1].time <= time) {
      scheds.push(event);
    } else {
      for (let i = 0, imax = scheds.length; i < imax; i++) {
        if (time < scheds[i].time) {
          scheds.splice(i, 0, event);
          break;
        }
      }
    }

    return id;
  }

  unsched(schedId) {
    const scheds = this._.scheds;

    for (let i = 0, imax = scheds.length; i < imax; i++) {
      if (schedId === scheds[i].id) {
        scheds.splice(i, 1);
        break;
      }
    }

    return schedId;
  }

  unschedAll() {
    this._.scheds.splice(0);
  }

  process() {
    const scheds = this._.scheds;
    const t0 = this.dateAPI.now() / 1000;
    const t1 = t0 + this.aheadTime;

    this.playbackTime = t0;
    this.context.beginSched();

    while (scheds.length && scheds[0].time < t1) {
      const event = scheds.shift();

      this.playbackTime = event.time;

      event.callback(...event.args);
    }

    this.context.endSched();
    this.playbackTime = t1;
  }
}
