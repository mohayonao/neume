import defineChainMethods from "./_defineChainMethods";

export const api = { random: Math.random };

export default function pirand(lo = 0.01, hi = 1, repeats = Infinity) {
  return defineChainMethods(function*() {
    for (let i = 0; i < repeats; i++) {

      yield lo * Math.exp(api.random() * Math.log(hi / lo));
    }
  });
}
