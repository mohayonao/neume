export default function wrapAt(list, index) {
  if (Array.isArray(list)) {
    return list[index % list.length];
  }
  return list;
}
