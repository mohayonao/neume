export default function isPlainObject(value) {
  return !!(value && Object.getPrototypeOf(value) === Object.prototype);
}
