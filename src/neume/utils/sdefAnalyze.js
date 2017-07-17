import { SCALAR } from "../constants";

const TYPE = 0;
const RATE = 1;
const SPECIAL_INDEX = 2;
const INPUTS = 3;
const OUTPUTS = 4;

export default function sdefAnalyze(sdef) {
  const ctls = {};
  const inputs = [];
  const outputs = [];

  if (sdef.paramValues && sdef.paramIndices) {
    sdef.paramIndices.forEach(({ name, index, length }) => {
      if (/^[a-z]\w*$/.test(name)) {
        const values = sdef.paramValues.slice(index, index + length);

        ctls[name] = { name, index, length, values };
      }
    });
  }

  sdef.units.forEach((unit, index, units) => {
    const unitType = unit[TYPE];

    if (unitType === "Out" || unitType === "In") {
      const bus = unit[INPUTS][0]; // The first item points to bus info.
      const ctl = units[bus[0]];

      if (ctl && ctl[TYPE] === "Control" && ctl[RATE] === SCALAR) {
        const rate = unit[RATE];
        const index = ctl[SPECIAL_INDEX] + bus[1];

        if (unitType === "Out") {
          outputs.push({ rate, index, length: unit[INPUTS].length - 1 });
        } else {
          inputs.push({ rate, index, length: unit[OUTPUTS].length });
        }
      }
    }
  });

  return { ctls, inputs, outputs };
}
