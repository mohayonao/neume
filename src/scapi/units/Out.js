import createNode from "../utils//createNode";
import createOutputNode from "../utils/createOutputNode";
import multiMap from "../utils/multiMap";

function $($rate) {
  return (bus, inputs) => {
    return createOutputNode(flatten(multiMap([ bus ].concat(inputs), (bus, ...inputs) => {
      if ($rate === "audio" && !inputs.every(isAudioRateOrZero)) {
        throw new TypeError(`node[Out] required audio inputs.`);
      }
      return createNode("Out", $rate, [ bus ].concat(inputs));
    })));
  };
}

function flatten(list) {
  if (Array.isArray(list)) {
    return list.reduce((list, item) => {
      return list.concat(flatten(item));
    }, []);
  }
  return [ list ];
}

function isAudioRateOrZero(node) {
  return node === 0 || node.rate === "audio";
}

const fn = $("audio");

fn.ar = $("audio");
fn.kr = $("control");

export default fn;

