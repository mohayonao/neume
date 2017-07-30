import createNode from "../utils/createNode";
import sortByRate from "./_sortByRate";

export default function createSumNode(...args) {
  const dict = { number: 0, items: [] };
  const { number, items } = collectSumItem(args, dict);

  if (items.length === 0) {
    return number;
  }

  if (number !== 0) {
    items.push(number);
  }

  return _createSumNode(sortByRate(items));
}

function collectSumItem(list, dict) {
  list.forEach((value) => {
    if (value.type === "+" || value.type === "Sum3" || value.type === "Sum4") {
      collectSumItem(value.props, dict);
    } else if (value.type === "MulAdd") {
      collectSumItem([
        createNode("*", value.rate, value.props.slice(0, 2)),
        value.props[2]
      ], dict);
    } else {
      if (typeof value === "number") {
        dict.number += value;
      } else {
        dict.items.push(value);
      }
    }
  });
  return dict;
}

function _createSumNode(props) {
  switch (props.length) {
  case 1:
    return props[0];
  case 2: {
    const [ a, b ] = props;

    if (a.type === "*") {
      return createNode("MulAdd", a.rate, [ a.props[0], a.props[1], b ]);
    }

    return createNode("+", props[0].rate, props);
  }
  case 3:
    return createNode("Sum3", props[0].rate, props);
  case 4:
    return createNode("Sum4", props[0].rate, props);
  }

  const length = Math.ceil(props.length / 4);

  return _createSumNode(Array.from({ length }, (_, index) => {
    return _createSumNode(props.slice(index * 4, index * 4 + 4));
  }));
}
