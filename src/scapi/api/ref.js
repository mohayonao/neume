import createRef from "../utils/createRef";
import unbind from "../utils/unbind";

function ref(value) {
  return createRef(() => value);
}

export default unbind(ref);
