import createNode from "../utils/createNode";
import isSCNode from "../utils/isSCNode";
import isNumber from "../utils/isNumber";
import sortByRate from "./_sortByRate";

export default function createMulNode(a, b) {
  if (isNumber(a * b)) {
    return a * b;
  }

  [ a, b ] = sortByRate([ a, b ]);

  if (b === 0) {
    return 0;
  }

  if (b === 1) {
    return a;
  }

  if (isSCNode(a) && a.type === "*" && isNumber(a.props[1] * b)) {
    return createNode("*", a.rate, [ a.props[0], a.props[1] * b ]);
  }

  return createNode("*", a.rate, [ a, b ]);
}
