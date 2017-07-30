import createNode from "../utils/createNode";
import createRef from "../utils/createRef";
import isNumber from "../utils/isNumber";
import isSCNode from "../utils/isSCNode";
import isSCRef from "../utils/isSCRef";
import toSCNodeInput from "../utils/toSCNodeInput";
import wrapAt from "../utils/wrapAt";
import sortByRate from "./_sortByRate";

export default function createOpNode(type, args, fn, disableCreateNode) {
  args = args.slice(0, fn.length);

  const length = args.reduce((length, item) => {
    return Array.isArray(item) ? Math.max(length, item.length) : length;
  }, 0);

  if (length !== 0) {
    return Array.from({ length }, (_, index) => {
      return createOpNode(type, args.map(item => wrapAt(item, index)), fn, disableCreateNode);
    });
  }

  if (args.some(isSCRef)) {
    return createRef(() => createOpNode(type, args.map(toSCNodeInput), fn, disableCreateNode));
  }

  if (!disableCreateNode) {
    if (args.some(isSCNode)) {
      return createNode(type, sortByRate(args.slice())[0].rate, args);
    }

    if (!args.every(isNumber)) {
      throw new TypeError(`
        op[${ type }] required ${ fn.length } numbers, but got NaN.
      `.trim());
    }
  }

  return fn(...args);
}
