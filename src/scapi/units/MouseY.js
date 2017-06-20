import defineUGen from "./_defineUGen";

export default defineUGen("MouseY", [
  [ "min" , 0   ],
  [ "max" , 1   ],
  [ "warp", 0   ],
  [ "lag" , 0.2 ],
], {
  rates: { kr: "control" },
  defaultRate: "control",
});
