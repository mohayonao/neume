import NeuObject from "../core/NeuObject";

export default class NeuSched extends NeuObject {
  constructor(context) {
    super(context);

    this._.process = this.process.bind(this);
  }

  get state() {
    return this._.state;
  }

  /* istanbul ignore next */
  start() {}

  /* istanbul ignore next */
  stop() {}

  /* istanbul ignore next */
  resume() {}

  /* istanbul ignore next */
  suspend() {}

  /* istanbul ignore next */
  at() {}

  /* istanbul ignore next */
  process() {}
}
