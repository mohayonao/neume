import nextValue from "./_nextValue";
import defineChainMethods from "./_defineChainMethods";

export default function pseq(list, repeats = 1) {
  return defineChainMethods(function*() {
    for (let i = 0; i < repeats; i++) {
      for (const value of list) {
        yield* nextValue(value);
      }
    }
  });
}
