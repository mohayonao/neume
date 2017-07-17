import nextValue from "./_nextValue";
import enumerate from "./_enumerate";
import defineChainMethods from "./_defineChainMethods";

export default function pmap(p, fn) {
  return defineChainMethods(function*() {
    const iter = p();

    for (const [ index, value ] of enumerate(iter)) {
      yield* nextValue(fn(value, index, iter));
    }
  });
}
