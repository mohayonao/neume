import zip from "./_zip";
import enumerate from "./_enumerate";
import toFilterGenFunc from "./_toFilterGenFunc";
import defineChainMethods from "./_defineChainMethods";

export default function pwhile(p, cond) {
  p = zip(p, toFilterGenFunc(cond));

  return defineChainMethods(function*() {
    const iter = p();

    for (const [ index, [ value, cond ] ] of enumerate(iter)) {
      if (!cond(value, index, iter)) {
        break;
      }
      yield value;
    }
  });
}
