export default function isOSCBundle(value) {
  return !!(value && Array.isArray(value.elements));
}
