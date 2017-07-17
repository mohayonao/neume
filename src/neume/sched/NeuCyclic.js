import NeuSchedProc from "../sched/NeuSchedProc";
import isGenFunc from "../utils/isGenFunc";
import pseq from "../pattern/pseq";

export default class NeuCyclic extends NeuSchedProc {
  static create(context, ...args) {
    return new NeuCyclic(...bindArgs(context, args));
  }

  constructor(context, src, pattern) {
    super(context, src);

    this._.params = {};
    this._.counter = 0;
    this._.pattern = [];
    this._.iter = null;

    if (pattern) {
      this.pattern = pattern;
    }
  }

  get pattern() {
    return this._.pattern;
  }

  set pattern(value) {
    this._.pattern = value;
    this._.iter = isGenFunc(value) ? pseq([ value ], Infinity)() : null;
  }

  apply(params) {
    Object.keys(params).forEach((key) => {
      if (params[key] == null) {
        delete this._.params[key];
      } else {
        this._.params[key] = toParams(params[key]);
      }
    });
    return this;
  }

  process() {
    const { context } = this;

    this.emit("sync", { count: this._.counter++ });
    this.emit("@@sync");

    const pattern = this._.iter ? this._.iter.next().value : this._.pattern;

    compilePattern(pattern, 0, 1, []).forEach(({ pos, payload }, index) => {
      context.sched(this._.src.at(pos), () => {
        const params = Object.keys(this._.params).reduce((obj, key) => {
          return (obj[key] = getValue(this._.params[key], index), obj);
        }, { $value: payload });

        this.emit("data", params);
      });
    });
  }
}

export function bindArgs(context, args) {
  return [ context, ...args ];
}

function compilePattern(pattern, pos, unit, list) {
  unit = unit / pattern.length;
  pattern.forEach((value, index) => {
    if (value != null) {
      if (Array.isArray(value)) {
        compilePattern(value, pos + unit * index, unit, list);
      } else {
        list.push({ pos: pos + unit * index, payload: value });
      }
    }
  });
  return list;
}

function getValue(value, index) {
  if (Array.isArray(value)) {
    return value[index % value.length];
  }
  if (value && typeof value.next === "function") {
    return value.next().value;
  }
  return value;
}

function toParams(value) {
  if (isGenFunc(value)) {
    return pseq([ value ], Infinity)();
  }
  return value;
}
