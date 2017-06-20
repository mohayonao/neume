import createRef from "./createRef";
import isNumber from "./isNumber";
import isSCNode from "./isSCNode";
import isSCRef from "./isSCRef";
import toSCNodeInput from "./toSCNodeInput";

export default function createNode(type, rate, props = []) {
  if (/\w~$/.test(type)) {
    type += Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  }

  if (props.some(isSCRef)) {
    return createRef(() => createNode(type, rate, props.map(toSCNodeInput)));
  }

  props = props.map(toSCNodeInput);

  if (props.some(isNotValidInput)) {
    throw new TypeError(`
      node[${ type }] required number or sc.node, but got ${ JSON.stringify(props) }.
    `.trim());
  }

  const node = Object.assign(Object.create({}), { type, rate, props });

  Object.defineProperties(node, {
    $$typeof: {
      value: "sc.node",
      enumerable: false, writable: true, configurable: true
    },
  });

  return node;
}

function isNotValidInput(value) {
  return !(isNumber(value) || isSCNode(value));
}
