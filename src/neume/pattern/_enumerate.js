export default function* enumerate(iter) {
  let index = 0;
  for (const value of iter) {
    yield [ index++, value];
  }
}
