import nextValue from "./_nextValue";
import defineChainMethods from "./_defineChainMethods";

export default function pfunc(fn, repeats = Infinity) {
  return defineChainMethods(function*() {
    for (let i = 0; i < repeats; i++) {
      yield* nextValue(fn(i, repeats));
    }
  });
}
