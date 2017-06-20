import defineUGen from "./_defineUGen";
import checkInputs from "./_checkInputs";

export default defineUGen("BufWr", [
  [ "inputs", 0 ],
  [ "bufnum", 0 ],
  [ "phase" , 0 ],
  [ "loop"  , 1 ],
], {
  rates: { ar: "audio", kr: "control" },
  composeArgs: args => args.concat(args.shift()),
  defaultRate: args => args[1].rate,
  createNode: checkInputs(1),
});
