import defineChainMethods from "./_defineChainMethods";

export default function pdrop(p, length = 1) {
  return defineChainMethods(function*() {
    let i = 0;
    for (const value of p()) {
      if (length <= i++) {
        yield value;
      }
    }
  });
}
