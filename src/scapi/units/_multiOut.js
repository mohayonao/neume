import createNode from "../utils/createNode";
import multiMap from "../utils/multiMap";

export default function multiOut(node, length) {
  node = _multiOut(node, length);
  if (node.length === 1) {
    return node[0];
  }
  return node;
}

function _multiOut(node, length) {
  if (Array.isArray(node)) {
    if (Array.isArray(length)) {
      return multiMap([ node, length ], multiOut);
    }
    return node.map(node => multiOut(node, length));
  }
  if (Array.isArray(length)) {
    return length.map(length => multiOut(node, length));
  }
  return Array.from({ length }, (_, index) => {
    return createNode("OutputProxy", node.rate, [ node, index, length ]);
  });
}
