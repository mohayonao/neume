import createNode from "./createNode";
import toArray from "./toArray";

export default function createOutputNode(items) {
  const object = createNode(0, "scalar", toArray(items));

  Object.defineProperties(object, {
    valueOf: {
      value: () => 0,
      enumerable: false, writable: true, configurable: true
    },
  });

  return object;
}
