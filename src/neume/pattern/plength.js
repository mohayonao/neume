import defineChainMethods from "./_defineChainMethods";

export default function plength(p, length = 1) {
  return defineChainMethods(function*() {
    let i = 0;
    while (i < length) {
      for (const value of p()) {
        yield value;
        if (length <= ++i) {
          break;
        }
      }
    }
  });
}
