import defineUGen from "./_defineUGen";

export default defineUGen("IRand~", [
  [ "lo",   0 ],
  [ "hi", 127 ],
], {
  rates: { new: "scalar" },
  defaultRate: "scalar",
});
