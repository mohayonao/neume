import multiMap from "../utils/multiMap";
import unbind from "../utils/unbind";
import createSumNode from "../operators/_createSumNode";

function mix(items) {
  return multiMap(items, (...items) => createSumNode(...items));
}

export default unbind(mix);
