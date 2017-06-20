export default function createRef(value) {
  const ref = typeof value === "function" ? value : () => value;

  if (ref.length !== 0) {
    throw new TypeError(`
      ref required no arguments function.
    `.trim());
  }

  Object.defineProperties(ref, {
    $$typeof: {
      value: "sc.ref",
      enumerable: false, writable: true, configurable: true
    },
    valueOf: {
      value: ref,
      enumerable: false, writable: true, configurable: true
    },
  });

  return ref;
}
