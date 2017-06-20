import defineUGen from "./_defineUGen";

export default defineUGen("PinkNoise~", [], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "audio",
  madd: true,
});
