import isPrimitive from "./isPrimitive";
import isSCNode from "./isSCNode";
import isSCRef from "./isSCRef";

export default function unbind(fn) {
  return function(...args) {
    if (typeof this !== "undefined" && (isPrimitive(this) || Array.isArray(this) || isSCNode(this) || isSCRef(this))) {
      return fn(...[ this ].concat(args));
    }
    return fn(...args);
  };
}
