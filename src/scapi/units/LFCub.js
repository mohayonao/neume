import defineUGen from "./_defineUGen";

export default defineUGen("LFCub", [
  [ "freq"  , 440 ],
  [ "iphase",   0 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "control",
  madd: true,
});
