import defineChainMethods from "./_defineChainMethods";

export default function ploop(p) {
  return defineChainMethods(function*() {
    while (true) {
      for (const value of p()) {
        yield value;
      }
    }
  });
}
