export { default as scapi } from "./scapi";
export { default as scdef } from "./scdef";

import $ from "./neume";
import SCSynthServer from "./scsynth/SCSynthServer";

export default $((/* opts */) => {
  return SCSynthServer;
});
