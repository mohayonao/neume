export default function isSDefJSON(value) {
  return !!(value && typeof value.name === "string" && Array.isArray(value.units));
}
