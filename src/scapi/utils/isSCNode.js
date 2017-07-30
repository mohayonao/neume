export default function isSCNode(value) {
  return !!(value && value.$$typeof === "sc.node");
}
