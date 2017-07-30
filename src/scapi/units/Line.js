import defineUGen from "./_defineUGen";

export default defineUGen("Line", [
  [ "start",  1 ],
  [ "end"  ,  0 ],
  [ "dur"  ,  1 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "control",
  madd: true,
  action: true,
});
