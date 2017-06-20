import defineUGen from "./_defineUGen";
import createNode from "../utils/createNode";
import isNumber from "../utils/isNumber";
import isSCNode from "../utils/isSCNode";
import toArray from "../utils/toArray";
import toSCNodeInput from "../utils/toSCNodeInput";

export default defineUGen("EnvGen", [
  [ "env"       , 0 ],
  [ "gate"      , 1 ],
  [ "levelScale", 1 ],
  [ "levelBias" , 0 ],
  [ "timeScale" , 1 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "control",
  action: true,
  createNode: createEnvNode
});

export function createEnvNode(type, rate, [ env, gate, levelScale, levelBias, timeScale, action ]) {
  const envArray = toArray(toSCNodeInput(env));

  if (!checkEnvArray(envArray)) {
    throw new TypeError(`
      Invalid envelope parameters.
    `.trim());
  }

  return createNode(type, rate, [ gate, levelScale, levelBias, timeScale, action ].concat(envArray));
}

export function checkEnvArray(envArray) {
  const nodeLength = envArray[1];

  if (envArray.length !== nodeLength * 4 + 4) {
    return false;
  }

  if (envArray.some(isNotValidInput)) {
    return false;
  }

  if (envArray[2] !== -99 && nodeLength <= envArray[2]) {
    return false;
  }

  if (envArray[3] !== -99 && nodeLength <= envArray[3]) {
    return false;
  }

  for (let i = 0; i < nodeLength; i++) {
    const shapeNumber = envArray[i * 4 + 6];

    if (!(0 <= shapeNumber && shapeNumber < 9)) {
      return false;
    }
  }

  return true;
}

function isNotValidInput(value) {
  return !(isNumber(value) || isSCNode(value));
}
