import defineUGen from "./_defineUGen";

export default defineUGen("LFNoise0~", [
  [ "freq", 500 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "control",
  madd: true,
});
