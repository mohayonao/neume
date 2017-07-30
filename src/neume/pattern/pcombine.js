import zip from "./_zip"
import nextValue from "./_nextValue";
import defineChainMethods from "./_defineChainMethods";

export default function pcombine(...args) {
  const fn = args.pop();
  const p = zip(...args);

  return defineChainMethods(function*() {
    for (const values of p()) {
      yield* nextValue(fn(...values));
    }
  });
}
