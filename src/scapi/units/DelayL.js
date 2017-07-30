import defineFilterUGen from "./_defineFilterUGen";

export default defineFilterUGen("DelayL", [
  [ "maxDelayTime", 0.2 ],
  [ "delayTime"   , 0.2 ],
]);
