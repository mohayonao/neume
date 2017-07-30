import nextValue from "./_nextValue";
import defineChainMethods from "./_defineChainMethods";

export const api = { random: Math.random };

export default function psample(list, length = list.length) {
  return defineChainMethods(function*() {
    for (let i = 0; i < length; i++) {
      yield* nextValue(randAt(list));
    }
  });
}

function randAt(list) {
  return list[(api.random() * list.length)|0];
}
