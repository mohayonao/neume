import createNode from "../utils/createNode";

export default function checkInputs(index) {
  return function(type, rate, props) {
    if (rate === null) {
      rate = props[index].rate;
    }

    if (rate === "audio" && props[index].rate !== "audio") {
      throw new TypeError(`
        ${ type } inputs[${ index }] is not audio rate: ${ props[index] }
      `.trim());
    }

    return createNode(type, rate, props);
  };
}
