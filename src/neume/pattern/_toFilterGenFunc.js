import isGenFunc from "../utils/isGenFunc";

export default function toFilterGenFunc(fn) {
  if (isGenFunc(fn)) {
    return function*() {
      for (const value of fn()) {
        yield () => value;
      }
    };
  }

  return function*() {
    while (true) { yield fn; }
  };
}
