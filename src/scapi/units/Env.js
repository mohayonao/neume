import declareFunc from "../utils/declareFunc";
import createRef from "../utils/createRef";
import toArray from "../utils/toArray";
import toSCNodeInput from "../utils/toSCNodeInput";
import wrapAt from "../utils/wrapAt";
import { mul } from "../operators/mul";
import { add } from "../operators/add";

const Env = (...args) => {
  return Env.new(...args);
};

Env.new = declareFunc([
  [ "levels"     ,   0 ],
  [ "times"      ,   0 ],
  [ "curve"      , "lin" ],
  [ "releaseNode",  -99  ],
  [ "loopNode"   ,  -99  ],
], (levels, times, curve, releaseNode, loopNode) => {
  levels = toArray(toSCNodeInput(levels));
  times  = toArray(toSCNodeInput(times));

  return createEnv(levels, times, curve, releaseNode, loopNode);
});

Env.tri = declareFunc([
  [ "dur"  , 1 ],
  [ "level", 1 ],
], (dur, level) => {
  const levels = [ 0, level, 0 ];
  const times  = [ mul(dur, 0.5), mul(dur, 0.5) ];
  const curve = "lin";

  return createEnv(levels, times, curve);
});

Env.sine = declareFunc([
  [ "dur"  , 1 ],
  [ "level", 1 ],
], (dur, level) => {
  const levels = [ 0, level, 0 ];
  const times  = [ mul(dur, 0.5), mul(dur, 0.5) ];
  const curve  = "sine";

  return createEnv(levels, times, curve);
});

Env.perc = declareFunc([
  [ "attackTime" ,  0.01 ],
  [ "releaseTime",  1    ],
  [ "level"      ,  1    ],
  [ "curve"      , -4    ],
], (attackTime, releaseTime, level, curve) => {
  const levels = [ 0, level, 0 ];
  const times  = [ attackTime, releaseTime ];

  return createEnv(levels, times, curve);
});

Env.linen = declareFunc([
  [ "attackTime" , 0.01 ],
  [ "sustainTime", 1    ],
  [ "releaseTime", 1    ],
  [ "level"      , 1    ],
  [ "curve"      , "lin" ],
], (attackTime, sustainTime, releaseTime, level, curve) => {
  const levels = [ 0, level, level, 0 ];
  const times  = [ attackTime, sustainTime, releaseTime ];

  return createEnv(levels, times, curve);
});

Env.step = declareFunc([
  [ "levels"     ,   0 ],
  [ "times"      ,   0 ],
  [ "releaseNode", -99 ],
  [ "loopNode"   , -99 ],
], (levels, times, releaseNode, loopNode) => {
  levels = toArray(toSCNodeInput(levels));
  times  = toArray(toSCNodeInput(times));

  levels = [ levels[0] ].concat(levels);

  return createEnv(levels, times, "step", releaseNode, loopNode);
});

Env.cutoff = declareFunc([
  [ "releaseTime", 0.1 ],
  [ "level"      , 1   ],
  [ "curve"      , "lin" ],
], (releaseTime, level, curve) => {
  const curveShape = toShapeNumber(curve);
  const releaseLevel = curveShape === 2 ? 1e-5 : 0;
  const levels = [ level, releaseLevel ];
  const times  = [ releaseTime ];

  return createEnv(levels, times, curve, 0);
});

Env.dadsr = declareFunc([
  [ "delayTime"   ,  0.1  ],
  [ "attackTime"  ,  0.01 ],
  [ "decayTime"   ,  0.3  ],
  [ "sustainLevel",  0.5  ],
  [ "releaseTime" ,  1    ],
  [ "peakLevel"   ,  1    ],
  [ "curve"       , -4    ],
  [ "bias"        ,  0    ],
], (delayTime, attackTime, decayTime, sustainLevel, releaseTime, peakLevel, curve, bias) => {
  const levels = [ 0, 0, peakLevel, mul(peakLevel, sustainLevel), 0 ].map(x => add(x, bias));
  const times  = [ delayTime, attackTime, decayTime, releaseTime ];

  return createEnv(levels, times, curve, 3);
});

Env.adsr = declareFunc([
  [ "attackTime"  , 0.01 ],
  [ "decayTime"   ,  0.3 ],
  [ "sustainLevel",  0.5 ],
  [ "releaseTime" ,  1   ],
  [ "peakLevel"   ,  1   ],
  [ "curve"       , -4   ],
  [ "bias"        ,  0   ],
], (attackTime, decayTime, sustainLevel, releaseTime, peakLevel, curve, bias) => {
  const levels = [ 0, peakLevel, mul(peakLevel, sustainLevel), 0 ].map(x => add(x, bias));
  const times  = [ attackTime, decayTime, releaseTime ];

  return createEnv(levels, times, curve, 2);
});

Env.asr = declareFunc([
  [ "attackTime"  ,  0.01 ],
  [ "sustainLevel",  0.5  ],
  [ "releaseTime" ,  1    ],
  [ "curve"       , -4    ],
  [ "bias"        ,  0    ],
], (attackTime, sustainLevel, releaseTime, curve, bias) => {
  const levels = [ 0, sustainLevel, 0 ].map(x => add(x, bias));
  const times  = [ attackTime, releaseTime ];

  return createEnv(levels, times, curve, 1);
});

function createEnv(levels, times, curve, releaseNode, loopNode) {
  if (levels.length !== times.length + 1) {
    throw new TypeError("env error!!");
  }
  return createRef(toEnvParams(levels, times, curve, releaseNode, loopNode));
}

function toEnvParams(levels, times, curve, releaseNode, loopNode) {
  const length = times.length;
  const params = [];

  params.push(toSCNodeInput(levels[0]));
  params.push(length);
  params.push(toSCNodeInput(defaults(releaseNode, -99)));
  params.push(toSCNodeInput(defaults(loopNode, -99)));

  for (let i = 0; i < length; i++) {
    params.push(toSCNodeInput(levels[i + 1]));
    params.push(toSCNodeInput(times[i]));
    params.push(toShapeNumber(wrapAt(curve, i)));
    params.push(toCurveValue(wrapAt(curve, i)));
  }

  return params;
}

const ShapeNames = {
  "stp": 0, "step": 0,
  "lin": 1, "linear": 1,
  "exp": 2, "exponential": 2,
  "sin": 3, "sine": 3,
  "wel": 4, "welch": 4,
  "sqr": 6, "squared": 6,
  "cub": 7, "cubed": 7,
  "hld": 8, "hold": 8,
};

function toShapeNumber(value) {
  if (ShapeNames.hasOwnProperty(value)) {
    return ShapeNames[value];
  }
  return 5;
}

function toCurveValue(value) {
  return typeof value !== "string" ? toSCNodeInput(value) : 0;
}

function defaults(value, defaultValue) {
  return value != null ? value : defaultValue;
}

export default Env;
