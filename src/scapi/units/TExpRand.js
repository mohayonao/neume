import defineUGen from "./_defineUGen";

export default defineUGen("TExpRand~", [
  [ "lo"  , 0.01 ],
  [ "hi"  , 1    ],
  [ "trig", 0    ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "control",
});
