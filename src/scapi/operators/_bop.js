import isPrimitive from "../utils/isPrimitive";
import unbind from "../utils/unbind";
import createOpNode from "./_createOpNode";

export default function bop(name, fn) {
  return unbind(function(a, b) {
    if (a == null || b == null) {
      return null;
    }
    if (isPrimitive(a) && isPrimitive(b)) {
      return fn(a, b);
    }
    return createOpNode(name, [ a, b ], fn);
  });
}
