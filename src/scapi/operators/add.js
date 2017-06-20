import isPrimitive from "../utils/isPrimitive";
import unbind from "../utils/unbind";
import createOpNode from "./_createOpNode";
import createSumNode from "./_createSumNode";

export function add(a, b) {
  if (a == null || b == null) {
    return null;
  }
  if (isPrimitive(a) && isPrimitive(b)) {
    return a + b;
  }
  return createOpNode("+", [ a, b ], (a, b) => {
    return createSumNode(a, b);
  }, true);
}

export default unbind(add);
