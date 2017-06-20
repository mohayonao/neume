import defineUGen from "./_defineUGen";
import checkInputs from "./_checkInputs";

export default defineUGen("BufRd", [
  [ "numChannels"  , 1 ],
  [ "bufnum"       , 0 ],
  [ "phase"        , 0 ],
  [ "loop"         , 1 ],
  [ "interpolation", 2 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: args => args[1].rate,
  createNode: checkInputs(1),
  multiOut: args => args.shift(),
});
