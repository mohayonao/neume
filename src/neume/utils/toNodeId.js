export default function toNodeId(value) {
  if (typeof value === "number") {
    return value|0;
  }

  if (value && typeof value.nodeId === "number") {
    return value.nodeId|0;
  }

  return 0;
}
