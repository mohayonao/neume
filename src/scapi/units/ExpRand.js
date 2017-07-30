import defineUGen from "./_defineUGen";

export default defineUGen("ExpRand~", [
  [ "lo", 0.01 ],
  [ "hi", 1    ],
], {
  rates: { new: "scalar" },
  defaultRate: "scalar",
});
