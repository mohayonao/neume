import zip from "./_zip";
import enumerate from "./_enumerate";
import toFilterGenFunc from "./_toFilterGenFunc";
import defineChainMethods from "./_defineChainMethods";

export default function preject(p, fn) {
  p = zip(p, toFilterGenFunc(fn));

  return defineChainMethods(function*() {
    const iter = p();

    for (const [ index, [ value, fn ] ] of enumerate(iter)) {
      if (!fn(value, index, iter)) {
        yield value;
      }
    }
  });
}
