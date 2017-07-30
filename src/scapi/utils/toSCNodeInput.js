export default function toSCNodeInput(value) {
  if (value) {
    if (typeof value.toSCNodeInput === "function") {
      return value.toSCNodeInput();
    }
    if (typeof value.valueOf === "function") {
      return value.valueOf();
    }
  }
  return value;
}
