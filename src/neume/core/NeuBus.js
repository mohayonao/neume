import NeuObject from "../core/NeuObject";
import scapi from "../../scapi";
import { AUDIO } from "../constants";

const { In } = scapi;

export default class NeuBus extends NeuObject {
  constructor(context, rate, index, length) {
    super(context);

    this.rate = rate;
    this.index = index;
    this.length = length;
  }

  get in() {
    if (this.rate === AUDIO) {
      return In.ar(this.index, this.length);
    }
    return In.kr(this.index, this.length);
  }

  set value(value) {
    this.set(value);
  }

  set(value) {
    if (this.rate === AUDIO) {
      throw new TypeError(`
        AudioBus cannot set value.
      `.trim());
    }

    const { context } = this;
    const cmd = context.commands.c_set(this.index, value);

    context.sendOSC(cmd);

    return this;
  }

  setAt(index, value) {
    if (this.rate === AUDIO) {
      throw new TypeError(`
        AudioBus cannot set value.
      `.trim());
    }

    if (!(0 <= index && index < this.length)) {
      throw new TypeError(`
        Control index out of range.
      `.trim());
    }

    const { context } = this;
    const cmd = context.commands.c_set(this.index + index, value);

    context.sendOSC(cmd);

    return this;
  }
}
