import NeuMetro from "../sched/NeuMetro";

export default class NeuCPS extends NeuMetro {
  static create(context, ...args) {
    return new NeuCPS(...bindArgs(context, args));
  }

  constructor(context, cps) {
    super(context, 1 / cps);
  }

  get value() {
    return 1 / super.value;
  }

  set value(newValue) {
    super.value = 1 / newValue;
  }
}

export function bindArgs(context, args) {
  return [ context, ...args ];
}
