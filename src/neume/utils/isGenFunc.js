export default function isGenFunc(value) {
  return typeof value === "function" && value.constructor.name === "GeneratorFunction";
}
