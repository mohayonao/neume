import defineChainMethods from "./_defineChainMethods";

export default function pcount(offset = 0, length = Infinity) {
  return defineChainMethods(function*() {
    for (let i = 0; i < length; i++) {
      yield i + offset;
    }
  });
}
