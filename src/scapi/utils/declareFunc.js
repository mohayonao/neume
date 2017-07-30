import isPlainObject from "./isPlainObject";

export default function declareFunc(propDefs, fn) {
  const indexOfProps = {};
  const defaultProps = [];

  propDefs.forEach(([ name, value ], index) => {
    indexOfProps[name] = index;
    defaultProps[index] = value;
  });

  function toProps(args) {
    const props = defaultProps.slice();
    const kwargs = isPlainObject(args[args.length - 1]) ? args.pop() : {};

    args.slice(0, defaultProps.length).forEach((value, index) => {
      props[index] = value;
    });

    Object.keys(kwargs).forEach((key) => {
      if (indexOfProps.hasOwnProperty(key)) {
        props[indexOfProps[key]] = kwargs[key];
      }
    });

    return props;
  }

  const gen = (...args) => fn(...toProps(args));

  Object.defineProperty(gen, "length", {
    value: defaultProps.length,
    enumerable: false, writable: true, configurable: true
  });

  return gen;
}
