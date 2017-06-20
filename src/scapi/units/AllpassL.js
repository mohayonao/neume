import defineFilterUGen from "./_defineFilterUGen";

export default defineFilterUGen("AllpassL", [
  [ "maxDelayTime", 0.2 ],
  [ "delayTime"   , 0.2 ],
  [ "decayTime"   , 1   ],
]);
