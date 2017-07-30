import unbind from "../utils/unbind";

function dup(value, length = 2) {
  return Array.from({ length }, () => value);
}

export default unbind(dup);

