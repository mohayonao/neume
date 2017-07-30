import defineFilterUGen from "./_defineFilterUGen";

export default defineFilterUGen("DelayC", [
  [ "maxDelayTime", 0.2 ],
  [ "delayTime"   , 0.2 ],
]);
