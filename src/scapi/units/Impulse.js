import defineUGen from "./_defineUGen";

export default defineUGen("Impulse", [
  [ "freq" , 440 ],
  [ "phase",   0 ]
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "audio",
  madd: true,
});
