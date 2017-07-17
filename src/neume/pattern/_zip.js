import toGenFuncIfNeeded from "./_toGenFuncIfNeeded";

export default function zip(...args) {
  return function*() {
    const iters = args.map(p => toGenFuncIfNeeded(p)());

    while (true) {
      const values = iters.map(iter => iter.next());

      if (values.some(({ done }) => done)) {
        break;
      }

      yield values.map(({ value }) => value);
    }
  };
}
