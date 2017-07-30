import createNode from "../utils/createNode";
import multiMap from "../utils/multiMap";

export default function multiNew(type, rate, props = [], create = createNode) {
  return multiMap(props, (...props) => create(type, rate, props));
}
