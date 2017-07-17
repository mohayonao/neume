import toGenFuncIfNeeded from "./_toGenFuncIfNeeded";
import defineChainMethods from "./_defineChainMethods";

export default function pchunk(p, n = 1) {
  p = toGenFuncIfNeeded(p);
  n = toGenFuncIfNeeded(n);

  return defineChainMethods(function*() {
    const piter = p();
    const niter = n();

    loop: while (true) {
      for (const n of niter) {
        const items = takeN(piter, n);

        if (items.length === 0) {
          break loop;
        }

        yield items;

        if (items.length < n) {
          break loop;
        }
      }

      break loop;
    }
  });
}

function takeN(iter, n) {
  const items = [];

  for (let i = 0; i < n; i++) {
    const { value, done } = iter.next();

    if (done) {
      break;
    }

    items.push(value);
  }

  return items;
}
