import defineUGen from "./_defineUGen";

const propDefs = [
  [ "bufnum", 0 ],
];

export default function defineBufInfoUGen($type) {
  return defineUGen($type, propDefs, {
    rates: { kr: "control", ir: "scalar" },
    defaultRate: "control"
  });
}
