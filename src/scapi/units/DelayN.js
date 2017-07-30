import defineFilterUGen from "./_defineFilterUGen";

export default defineFilterUGen("DelayN", [
  [ "maxDelayTime", 0.2 ],
  [ "delayTime"   , 0.2 ],
]);
