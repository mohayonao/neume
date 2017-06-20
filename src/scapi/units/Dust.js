import defineUGen from "./_defineUGen";

export default defineUGen("Dust~", [
  [ "density", 0 ]
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "audio",
  madd: true,
});
