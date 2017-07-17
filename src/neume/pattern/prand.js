import defineChainMethods from "./_defineChainMethods";

export const api = { random: Math.random };

export default function prand(lo = 0, hi = 1, repeats = Infinity) {
  return defineChainMethods(function*() {
    for (let i = 0; i < repeats; i++) {
      yield api.random() * (hi - lo) + lo;
    }
  });
}
