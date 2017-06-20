import defineUGen from "./_defineUGen";

export default defineUGen("TIRand~", [
  [ "lo"  ,   0 ],
  [ "hi"  , 127 ],
  [ "trig",   0 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "control",
});
