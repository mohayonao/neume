import isSCNode from "./isSCNode";

export default function isSCOutputNode(value) {
  return isSCNode(value) && value.type === 0;
}
