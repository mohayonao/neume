import defineUGen from "./_defineUGen";

export default defineUGen("SinOscFB", [
  [ "freq"     , 440 ],
  [ "fee,dback",   0 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "audio",
  madd: true,
});
