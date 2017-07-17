import zip from "./_zip"
import defineChainMethods from "./_defineChainMethods";

export default function place(...args) {
  const p = zip(...args);

  return defineChainMethods(function*() {
    for (const values of p()) {
      for (const value of values) {
        yield value;
      }
    }
  });
}
