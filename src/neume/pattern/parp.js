import zip from "./_zip";
import arp from "../music/arp";
import defineChainMethods from "./_defineChainMethods";

export default function parp(noteNumbers, style, length = -1, distance = 0) {
  const p = zip(noteNumbers, style, length, distance);

  return defineChainMethods(function*() {
    for (const [ noteNumbers, style, length, distance ] of p()) {
      for (const value of arp(noteNumbers, style, length, distance)) {
        yield value;
      }
    }
  });
}
