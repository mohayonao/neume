export { default as scapi } from "./scapi";
export { default as scdef } from "./scdef";

import $ from "./neume";
import SCSynthWorker from "./scsynth/SCSynthWorker";

export default $((/* opts */) => {
  return SCSynthWorker;
});
