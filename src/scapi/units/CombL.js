import defineFilterUGen from "./_defineFilterUGen";

export default defineFilterUGen("CombL", [
  [ "maxDelayTime", 0.2 ],
  [ "delayTime"   , 0.2 ],
  [ "decayTime"   , 1   ],
]);
