import defineChainMethods from "./_defineChainMethods";

export const api = { random: Math.random };

export default function pirand(lo = 0, hi = 127, repeats = Infinity) {
  return defineChainMethods(function*() {
    for (let i = 0; i < repeats; i++) {
      yield Math.floor(api.random() * (hi - lo) + lo);
    }
  });
}
