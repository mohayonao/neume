import isGenFunc from "../utils/isGenFunc";

export default function* nextValue(value) {
  if (isGenFunc(value)) {
    yield* value();
  } else {
    yield value;
  }
}
