import NeuSchedSrc from "../sched/NeuSchedSrc";

export default class NeuMetro extends NeuSchedSrc {
  static create(context, ...args) {
    return new NeuMetro(...bindArgs(context, args));
  }

  constructor(context, interval) {
    super(context);

    this._.currentInterval = interval;
    this._.nextInterval = interval;
    this._.currentTime = 0;
    this._.nextTime = this.at(1);
    this._.counter = 0;
  }

  get value() {
    return this._.nextInterval;
  }

  set value(newValue) {
    this._.nextInterval = newValue;
  }

  at(pos) {
    pos = Math.max(0, Math.min(pos, 1));

    return this._.currentTime + (this._.currentInterval) * pos;
  }

  process(time) {
    const { context } = this;

    this._.currentTime = time;

    if (this._.state === "running") {
      this.emit("sync", { count: this._.counter++ });
    }

    this._.currentInterval = this._.nextInterval;
    this._.nextTime = this.at(1);

    if (this._.state === "running") {
      this.emit("@@sync");
    }

    return context.sched(this._.nextTime, this._.process, this._.nextTime);
  }
}

export function bindArgs(context, args) {
  return [ context, ...args ];
}
