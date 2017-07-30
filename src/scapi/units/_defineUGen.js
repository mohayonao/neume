import declareFunc from "../utils/declareFunc";
import multiNew from "./_multiNew";
import multiOut from "./_multiOut";
import createNode from "../utils/createNode";
import { madd } from "../operators/madd";

export default function defineUGen($type, $propDefs, opts) {
  const propDefs = $propDefs.slice();
  const createNodeFn = opts.createNode || createNode;

  if (opts.madd) {
    propDefs.push([ "mul", 1 ], [ "add", 0 ]);
  }
  if (opts.action) {
    propDefs.push([ "action", 0 ]);
  }

  function $($rate) {
    return (...args) => {
      let node, mul, add, numChannels;

      if (opts.composeArgs) {
        args = opts.composeArgs(args);
      }

      if (opts.madd) {
        [ mul, add ] = opts.action ? args.splice(-3, 2) : args.splice(-2, 2);
      }

      if (opts.multiOut) {
        if (typeof opts.multiOut === "function") {
          numChannels = opts.multiOut(args);
        } else {
          numChannels = opts.multiOut;
        }
      }

      if (typeof $rate === "function") {
        $rate = $rate(args);
      }

      node = multiNew($type, $rate, args, createNodeFn);

      if (opts.multiOut) {
        node = multiOut(node, numChannels);
      }

      if (opts.madd) {
        node = madd(node, mul, add);
      }

      return node;
    };
  }

  const fn = declareFunc(propDefs, $(opts.defaultRate));

  Object.keys(opts.rates).forEach((name) => {
    fn[name] = declareFunc(propDefs, $(opts.rates[name]));
  });

  return fn;
}
