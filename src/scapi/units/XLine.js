import defineUGen from "./_defineUGen";

export default defineUGen("XLine", [
  [ "start",  1    ],
  [ "end"  ,  0.01 ],
  [ "dur"  ,  1    ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "control",
  madd: true,
  action: true,
});
