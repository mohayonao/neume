export default function sdefName(fn) {
  return fn.name || `temp-${ Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) }`;
}
