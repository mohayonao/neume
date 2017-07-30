import defineUGen from "./_defineUGen";

export default defineUGen("TRand~", [
  [ "lo"  , 0 ],
  [ "hi"  , 1 ],
  [ "trig", 0 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "control",
});
