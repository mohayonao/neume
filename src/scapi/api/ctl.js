import createNode from "../utils/createNode";
import toNumber from "../utils/toNumber";

function ctl(name, value) {
  return createControl("#", name, "control", value);
}

ctl.ar = function(name, value) {
  return createControl("#", name, "audio", value);
};

ctl.kr = function(name, value) {
  return createControl("#", name, "control", value);
};

ctl.ir = function(name, value) {
  return createControl("#", name, "scalar", value);
};

ctl.tr = function(name, value) {
  return createControl("!", name, "control", value);
};

function createControl(ch, name, rate, value) {
  if (!/^[a-z]\w*$/.test(name)) {
    throw new TypeError(`
      Invalid parameter name: '${ name }'
    `.trim());
  }

  const type = `${ ch }${ name }`;
  const toValue = ch === "#" ? toNumber : toTrigNumber;

  if (Array.isArray(value)) {
    return value.map((value, index, values) => {
      return createNode(type, rate, [ toValue(value), index, values.length ]);
    });
  }

  return createNode(type, rate, [ toValue(value), 0, 1 ]);
}

function toTrigNumber(value) {
  return +!!value;
}

export default ctl;
