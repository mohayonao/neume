import defineUGen from "./_defineUGen";

export default defineUGen("LFPulse", [
  [ "freq"  , 440   ],
  [ "iphase",   0   ],
  [ "width" ,   0.5 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "control",
  madd: true,
});
