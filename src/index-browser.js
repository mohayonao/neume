import $ from "./neume";
import SCSynthWorker from "./scsynth/SCSynthWorker";

export default $((/* opts */) => {
  return SCSynthWorker;
});
