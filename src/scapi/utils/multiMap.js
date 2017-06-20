import wrapAt from "./wrapAt";

export default function multiMap(list, fn) {
  const length = list.reduce((length, item) => {
    return Array.isArray(item) ? Math.max(length, item.length) : length;
  }, 0);

  if (length === 0) {
    return fn(...list);
  }

  return Array.from({ length }, (_, index) => {
    return multiMap(list.map(item => wrapAt(item, index)), fn);
  });
}
