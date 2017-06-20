/**
 * Return true when given a primitive type value
 * @param {any} value
 */
export default function isPrimitive(value) {
  return value == null || (typeof value !== "object" && typeof value !== "function");
}
