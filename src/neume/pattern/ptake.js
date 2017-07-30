import defineChainMethods from "./_defineChainMethods";

export default function ptake(p, length = 1) {
  return defineChainMethods(function*() {
    let i = 0;
    for (const value of p()) {
      if (i++ < length) {
        yield value;
      } else {
        break;
      }
    }
  });
}
