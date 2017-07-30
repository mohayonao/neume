import defineChainMethods from "./_defineChainMethods";

export default function pconcat(...args) {
  return defineChainMethods(function*() {
    for (const p of args) {
      for (const value of p()) {
        yield value;
      }
    }
  });
}
