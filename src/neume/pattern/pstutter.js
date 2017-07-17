import zip from "./_zip";
import defineChainMethods from "./_defineChainMethods";

export default function pstutter(p, n = 2) {
  p = zip(p, n);

  return defineChainMethods(function*() {
    for (const [ value, repeats ] of p()) {
      for (let i = 0; i < repeats; i++) {
        yield value;
      }
    }
  });
}
