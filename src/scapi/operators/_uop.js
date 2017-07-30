import isPrimitive from "../utils/isPrimitive";
import unbind from "../utils/unbind";
import createOpNode from "./_createOpNode";

export default function uop(name, fn) {
  return unbind(function(a) {
    if (a == null) {
      return null;
    }
    if (isPrimitive(a)) {
      return fn(a);
    }
    return createOpNode(name, [ a ], fn);
  });
}
