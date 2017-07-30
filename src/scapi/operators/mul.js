import isPrimitive from "../utils/isPrimitive";
import unbind from "../utils/unbind";
import createOpNode from "./_createOpNode";
import createMulNode from "./_createMulNode";

export function mul(a, b) {
  if (a == null || b == null) {
    return null;
  }
  if (isPrimitive(a) && isPrimitive(b)) {
    return a * b;
  }
  return createOpNode("*", [ a, b ], (a, b) => {
    return createMulNode(a, b);
  }, true);
}

export default unbind(mul);
