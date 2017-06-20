/**
 * Return true when given a numeric
 * @param {any} value
 */
export default function isNumner(value) {
  return typeof value === "number" && !Number.isNaN(value);
}
