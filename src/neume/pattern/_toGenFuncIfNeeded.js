import isGenFunc from "../utils/isGenFunc";

export default function toGenFuncIfNeeded(value) {
  if (isGenFunc(value)) {
    return value;
  }
  return function*() {
    while (true) { yield value }
  }
}
