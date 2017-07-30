import defineUGen from "./_defineUGen";

export default defineUGen("LFNoise2~", [
  [ "freq", 500 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "control",
  madd: true,
});
