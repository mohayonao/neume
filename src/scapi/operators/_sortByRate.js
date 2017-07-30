export default function sortByRate(list) {
  return list.sort(comparator);
}

function comparator(a, b) {
  a = (a && a.rate) || "scalar";
  b = (b && b.rate) || "scalar";

  return a > b;
}
