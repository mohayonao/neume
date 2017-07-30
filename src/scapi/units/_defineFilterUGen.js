import defineUGen from "./_defineUGen";
import checkInputs from "./_checkInputs";

export default function defineFilterUGen($type, $propDefs) {
  const propDefs = [ [ "in", 0 ], ...$propDefs ];

  return defineUGen($type, propDefs, {
    rates: { ar: "audio", kr: "control" },
    defaultRate: args => args[0].rate,
    madd: true,
    createNode: checkInputs(0)
  });
}
