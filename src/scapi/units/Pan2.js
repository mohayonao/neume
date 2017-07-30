import defineUGen from "./_defineUGen";
import checkInputs from "./_checkInputs";

export default defineUGen("Pan2", [
  [ "in"   , 0 ],
  [ "pos"  , 0 ],
  [ "level", 1 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: null,
  createNode: checkInputs(0),
  multiOut: 2,
});
