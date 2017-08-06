import * as commonAPI from "./common";

export function createAPI(...api) {
  return Object.assign({}, commonAPI, ...api);
}
