import nextValue from "./_nextValue";
import enumerate from "./_enumerate";
import defineChainMethods from "./_defineChainMethods";

export default function pscan(p, fn, prev = 0) {
  return defineChainMethods(function*() {
    const iter = p();

    for (const [ index, value ] of enumerate(iter)) {
      yield* nextValue(prev = fn(prev, value, index, iter));
    }
  });
}
