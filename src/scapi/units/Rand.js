import defineUGen from "./_defineUGen";

export default defineUGen("Rand~", [
  [ "lo", 0 ],
  [ "hi", 1 ],
], {
  rates: { new: "scalar" },
  defaultRate: "scalar",
});
