import unbind from "../utils/unbind";
import createOpNode from "./_createOpNode";
import createMulNode from "./_createMulNode";
import createSumNode from "./_createSumNode";

export function madd(a, b, c) {
  if (a == null || b == null || c == null) {
    return null;
  }
  return createOpNode("madd", [ a, b, c ], (a, b, c) => {
    return createSumNode(createMulNode(a, b), c);
  }, true);
}

export default unbind(madd);
