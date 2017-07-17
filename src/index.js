export { default as scapi } from "./scapi";
export { default as scdef } from "./scdef";

import $ from "./neume";
import SCSynthServer from "./scsynth/SCSynthServer";
import SCSynthWorker from "./scsynth/SCSynthWorker";

export default $((opts = {}) => {
  if (typeof opts.workerPath === "string") {
    return SCSynthWorker;
  }
  return SCSynthServer;
});
