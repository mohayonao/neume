import defineUGen from "./_defineUGen";

export default defineUGen("WhiteNoise~", [], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "audio",
  madd: true,
});
