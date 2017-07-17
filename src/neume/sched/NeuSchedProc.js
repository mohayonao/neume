import NeuSched from "../sched/NeuSched";

export default class NeuSchedProc extends NeuSched {
  constructor(context, src) {
    super(context);

    this._.src = src;
    this._.state = "running";
    this._.src.addListener("@@sync", this._.process);
  }

  start(startTime) {
    this._.src.start(startTime);
    return this;
  }

  stop(stopTime) {
    this._.src.stop(stopTime);
    return this;
  }

  suspend() {
    if (this._.state === "running") {
      this._.state = "suspended";
      this._.src.removeListener("@@sync", this._.process);
    }
    return this;
  }

  resume() {
    if (this._.state === "suspended") {
      this._.state = "running";
      this._.src.addListener("@@sync", this._.process);
    }
    return this;
  }

  at(pos) {
    return this._.src.at(pos);
  }
}
