export default function isSCRef(value) {
  return !!(value && value.$$typeof === "sc.ref");
}
