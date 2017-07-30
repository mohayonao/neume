import NeuSched from "../sched/NeuSched";

export default class NeuSchedSrc extends NeuSched {
  constructor(context) {
    super(context);

    this._.state = "suspended";
    this._.schedId = 0;
  }

  start(startTime) {
    if (this._.schedId === 0) {
      this._.state = "running";

      if (typeof startTime !== "number") {
        // TODO: 250msec ???
        startTime = Date.now() / 1000 + 0.25;
      }

      this._.schedId = this._.process(startTime);
    }
    return this;
  }

  stop() {
    if (this._.schedId !== 0) {
      this.context.unsched(this._.schedId);
      this._.state = "suspended";
      this._.stateId = 0;
    }
    return this;
  }

  resume() {
    /* istanbul ignore next */
    if (this._.state === "suspended") {
      this._.state = "running";
    }
  }

  suspend() {
    /* istanbul ignore next */
    if (this._.state === "running") {
      this._.state = "suspended";
    }
  }
}
