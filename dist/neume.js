(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.neume = {})));
}(this, (function (exports) { 'use strict';

function createRef(value) {
  const ref = typeof value === "function" ? value : () => value;

  if (ref.length !== 0) {
    throw new TypeError(`
      ref required no arguments function.
    `.trim());
  }

  Object.defineProperties(ref, {
    $$typeof: {
      value: "sc.ref",
      enumerable: false, writable: true, configurable: true
    },
    valueOf: {
      value: ref,
      enumerable: false, writable: true, configurable: true
    },
  });

  return ref;
}

/**
 * Return true when given a numeric
 * @param {any} value
 */
function isNumner(value) {
  return typeof value === "number" && !Number.isNaN(value);
}

function isSCNode(value) {
  return !!(value && value.$$typeof === "sc.node");
}

function isSCRef(value) {
  return !!(value && value.$$typeof === "sc.ref");
}

function toSCNodeInput(value) {
  if (value) {
    if (typeof value.toSCNodeInput === "function") {
      return value.toSCNodeInput();
    }
    if (typeof value.valueOf === "function") {
      return value.valueOf();
    }
  }
  return value;
}

function createNode(type, rate, props = []) {
  if (/\w~$/.test(type)) {
    type += Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  }

  if (props.some(isSCRef)) {
    return createRef(() => createNode(type, rate, props.map(toSCNodeInput)));
  }

  props = props.map(toSCNodeInput);

  if (props.some(isNotValidInput)) {
    throw new TypeError(`
      node[${ type }] required number or sc.node, but got ${ JSON.stringify(props) }.
    `.trim());
  }

  const node = Object.assign(Object.create({}), { type, rate, props });

  Object.defineProperties(node, {
    $$typeof: {
      value: "sc.node",
      enumerable: false, writable: true, configurable: true
    },
  });

  return node;
}

function isNotValidInput(value) {
  return !(isNumner(value) || isSCNode(value));
}

function toNumber(value) {
  return +value || 0;
}

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

/**
 * Return true when given a primitive type value
 * @param {any} value
 */
function isPrimitive(value) {
  return value == null || (typeof value !== "object" && typeof value !== "function");
}

function unbind(fn) {
  return function(...args) {
    if (typeof this !== "undefined" && (isPrimitive(this) || Array.isArray(this) || isSCNode(this) || isSCRef(this))) {
      return fn(...[ this ].concat(args));
    }
    return fn(...args);
  };
}

function dup(value, length = 2) {
  return Array.from({ length }, () => value);
}

var dup$1 = unbind(dup);

function wrapAt(list, index) {
  if (Array.isArray(list)) {
    return list[index % list.length];
  }
  return list;
}

function multiMap(list, fn) {
  const length = list.reduce((length, item) => {
    return Array.isArray(item) ? Math.max(length, item.length) : length;
  }, 0);

  if (length === 0) {
    return fn(...list);
  }

  return Array.from({ length }, (_, index) => {
    return multiMap(list.map(item => wrapAt(item, index)), fn);
  });
}

function sortByRate(list) {
  return list.sort(comparator);
}

function comparator(a, b) {
  a = (a && a.rate) || "scalar";
  b = (b && b.rate) || "scalar";

  return a > b;
}

function createSumNode(...args) {
  const dict = { number: 0, items: [] };
  const { number, items } = collectSumItem(args, dict);

  if (items.length === 0) {
    return number;
  }

  if (number !== 0) {
    items.push(number);
  }

  return _createSumNode(sortByRate(items));
}

function collectSumItem(list, dict) {
  list.forEach((value) => {
    if (value.type === "+" || value.type === "Sum3" || value.type === "Sum4") {
      collectSumItem(value.props, dict);
    } else if (value.type === "MulAdd") {
      collectSumItem([
        createNode("*", value.rate, value.props.slice(0, 2)),
        value.props[2]
      ], dict);
    } else {
      if (typeof value === "number") {
        dict.number += value;
      } else {
        dict.items.push(value);
      }
    }
  });
  return dict;
}

function _createSumNode(props) {
  switch (props.length) {
  case 1:
    return props[0];
  case 2: {
    const [ a, b ] = props;

    if (a.type === "*") {
      return createNode("MulAdd", a.rate, [ a.props[0], a.props[1], b ]);
    }

    return createNode("+", props[0].rate, props);
  }
  case 3:
    return createNode("Sum3", props[0].rate, props);
  case 4:
    return createNode("Sum4", props[0].rate, props);
  }

  const length = Math.ceil(props.length / 4);

  return _createSumNode(Array.from({ length }, (_, index) => {
    return _createSumNode(props.slice(index * 4, index * 4 + 4));
  }));
}

function mix(items) {
  return multiMap(items, (...items) => createSumNode(...items));
}

var mix$1 = unbind(mix);

function ref(value) {
  return createRef(() => value);
}

var ref$1 = unbind(ref);



var api = Object.freeze({
	ctl: ctl,
	dup: dup$1,
	mix: mix$1,
	ref: ref$1
});

function createOpNode(type, args, fn, disableCreateNode) {
  args = args.slice(0, fn.length);

  const length = args.reduce((length, item) => {
    return Array.isArray(item) ? Math.max(length, item.length) : length;
  }, 0);

  if (length !== 0) {
    return Array.from({ length }, (_, index) => {
      return createOpNode(type, args.map(item => wrapAt(item, index)), fn, disableCreateNode);
    });
  }

  if (args.some(isSCRef)) {
    return createRef(() => createOpNode(type, args.map(toSCNodeInput), fn, disableCreateNode));
  }

  if (!disableCreateNode) {
    if (args.some(isSCNode)) {
      return createNode(type, sortByRate(args.slice())[0].rate, args);
    }

    if (!args.every(isNumner)) {
      throw new TypeError(`
        op[${ type }] required ${ fn.length } numbers, but got NaN.
      `.trim());
    }
  }

  return fn(...args);
}

function uop(name, fn) {
  return unbind(function(a) {
    if (a == null) {
      return null;
    }
    if (isPrimitive(a)) {
      return fn(a);
    }
    return createOpNode(name, [ a ], fn);
  });
}

var abs = uop("abs", Math.abs);

var acos = uop("acos", Math.acos);

function add(a, b) {
  if (a == null || b == null) {
    return null;
  }
  if (isPrimitive(a) && isPrimitive(b)) {
    return a + b;
  }
  return createOpNode("+", [ a, b ], (a, b) => {
    return createSumNode(a, b);
  }, true);
}

var add$1 = unbind(add);

var asin = uop("asin", Math.asin);

var atan = uop("atan", Math.atan);

var ceil = uop("ceil", Math.ceil);

var cos = uop("cos", Math.cos);

var cosh = uop("cosh", Math.cosh);

var cubed = uop("cubed", a => a * a * a);

function bop(name, fn) {
  return unbind(function(a, b) {
    if (a == null || b == null) {
      return null;
    }
    if (isPrimitive(a) && isPrimitive(b)) {
      return fn(a, b);
    }
    return createOpNode(name, [ a, b ], fn);
  });
}

var div = bop("/", (a, b) => a / b);

var exp = uop("exp", Math.exp);

var floor = uop("floor", Math.floor);

var frac = uop("frac", a => a % 1);

var ge = bop(">=", (a, b) => a >= b);

var gt = bop(">", (a, b) => a > b);

var idiv = bop("//", (a, b) => Math.floor(a / b));

var le = bop("<=", (a, b) => a <= b);

var log = uop("log", Math.log);

var log2 = uop("log2", Math.log2);

var log10 = uop("log10", Math.log10);

var lt = bop("<", (a, b) => a < b);

function createMulNode(a, b) {
  if (isNumner(a * b)) {
    return a * b;
  }

  [ a, b ] = sortByRate([ a, b ]);

  if (b === 0) {
    return 0;
  }

  if (b === 1) {
    return a;
  }

  if (isSCNode(a) && a.type === "*" && isNumner(a.props[1] * b)) {
    return createNode("*", a.rate, [ a.props[0], a.props[1] * b ]);
  }

  return createNode("*", a.rate, [ a, b ]);
}

function madd(a, b, c) {
  if (a == null || b == null || c == null) {
    return null;
  }
  return createOpNode("madd", [ a, b, c ], (a, b, c) => {
    return createSumNode(createMulNode(a, b), c);
  }, true);
}

var madd$1 = unbind(madd);

var max = bop("max", Math.max);

var midicps = uop("midicps", a => 440 * Math.pow(2, (a - 69) / 12));

var min = bop("min", Math.min);

var mod = bop("%", (a, b) => a % b);

function mul(a, b) {
  if (a == null || b == null) {
    return null;
  }
  if (isPrimitive(a) && isPrimitive(b)) {
    return a * b;
  }
  return createOpNode("*", [ a, b ], (a, b) => {
    return createMulNode(a, b);
  }, true);
}

var mul$1 = unbind(mul);

var neg = uop("neg", a => -a);

var rand = uop("rand", a => Math.random() * a);

var rand2 = uop("rand2", a => (Math.random() * 2 - 1) * a);

var reciprocal = uop("reciprocal", a => 1 / a);

var sign = uop("sign", Math.sign);

var sin = uop("sin", Math.sin);

var sinh = uop("sinh", Math.sinh);

var sqrt = uop("sqrt", Math.sqrt);

var squared = uop("squared", a => a * a);

var sub = bop("-", (a, b) => a - b);

var tan = uop("tan", Math.tan);

var tanh = uop("tanh", Math.tanh);



var operators = Object.freeze({
	abs: abs,
	acos: acos,
	add: add$1,
	asin: asin,
	atan: atan,
	ceil: ceil,
	cos: cos,
	cosh: cosh,
	cubed: cubed,
	div: div,
	exp: exp,
	floor: floor,
	frac: frac,
	ge: ge,
	gt: gt,
	idiv: idiv,
	le: le,
	log: log,
	log2: log2,
	log10: log10,
	lt: lt,
	madd: madd$1,
	max: max,
	midicps: midicps,
	min: min,
	mod: mod,
	mul: mul$1,
	neg: neg,
	rand: rand,
	rand2: rand2,
	reciprocal: reciprocal,
	sign: sign,
	sin: sin,
	sinh: sinh,
	sqrt: sqrt,
	squared: squared,
	sub: sub,
	tan: tan,
	tanh: tanh
});

function isPlainObject(value) {
  return !!(value && Object.getPrototypeOf(value) === Object.prototype);
}

function declareFunc(propDefs, fn) {
  const indexOfProps = {};
  const defaultProps = [];

  propDefs.forEach(([ name, value ], index) => {
    indexOfProps[name] = index;
    defaultProps[index] = value;
  });

  function toProps(args) {
    const props = defaultProps.slice();
    const kwargs = isPlainObject(args[args.length - 1]) ? args.pop() : {};

    args.slice(0, defaultProps.length).forEach((value, index) => {
      props[index] = value;
    });

    Object.keys(kwargs).forEach((key) => {
      if (indexOfProps.hasOwnProperty(key)) {
        props[indexOfProps[key]] = kwargs[key];
      }
    });

    return props;
  }

  const gen = (...args) => fn(...toProps(args));

  Object.defineProperty(gen, "length", {
    value: defaultProps.length,
    enumerable: false, writable: true, configurable: true
  });

  return gen;
}

function multiNew(type, rate, props = [], create = createNode) {
  return multiMap(props, (...props) => create(type, rate, props));
}

function multiOut(node, length) {
  node = _multiOut(node, length);
  if (node.length === 1) {
    return node[0];
  }
  return node;
}

function _multiOut(node, length) {
  if (Array.isArray(node)) {
    if (Array.isArray(length)) {
      return multiMap([ node, length ], multiOut);
    }
    return node.map(node => multiOut(node, length));
  }
  if (Array.isArray(length)) {
    return length.map(length => multiOut(node, length));
  }
  return Array.from({ length }, (_, index) => {
    return createNode("OutputProxy", node.rate, [ node, index, length ]);
  });
}

function defineUGen($type, $propDefs, opts) {
  const propDefs = $propDefs.slice();
  const createNodeFn = opts.createNode || createNode;

  if (opts.madd) {
    propDefs.push([ "mul", 1 ], [ "add", 0 ]);
  }
  if (opts.action) {
    propDefs.push([ "action", 0 ]);
  }

  function $($rate) {
    return (...args) => {
      let node, mul, add, numChannels;

      if (opts.composeArgs) {
        args = opts.composeArgs(args);
      }

      if (opts.madd) {
        [ mul, add ] = opts.action ? args.splice(-3, 2) : args.splice(-2, 2);
      }

      if (opts.multiOut) {
        if (typeof opts.multiOut === "function") {
          numChannels = opts.multiOut(args);
        } else {
          numChannels = opts.multiOut;
        }
      }

      if (typeof $rate === "function") {
        $rate = $rate(args);
      }

      node = multiNew($type, $rate, args, createNodeFn);

      if (opts.multiOut) {
        node = multiOut(node, numChannels);
      }

      if (opts.madd) {
        node = madd(node, mul, add);
      }

      return node;
    };
  }

  const fn = declareFunc(propDefs, $(opts.defaultRate));

  Object.keys(opts.rates).forEach((name) => {
    fn[name] = declareFunc(propDefs, $(opts.rates[name]));
  });

  return fn;
}

function checkInputs(index) {
  return function(type, rate, props) {
    if (rate === null) {
      rate = props[index].rate;
    }

    if (rate === "audio" && props[index].rate !== "audio") {
      throw new TypeError(`
        ${ type } inputs[${ index }] is not audio rate: ${ props[index] }
      `.trim());
    }

    return createNode(type, rate, props);
  };
}

function defineFilterUGen($type, $propDefs) {
  const propDefs = [ [ "in", 0 ], ...$propDefs ];

  return defineUGen($type, propDefs, {
    rates: { ar: "audio", kr: "control" },
    defaultRate: args => args[0].rate,
    madd: true,
    createNode: checkInputs(0)
  });
}

var AllpassC = defineFilterUGen("AllpassC", [
  [ "maxDelayTime", 0.2 ],
  [ "delayTime"   , 0.2 ],
  [ "decayTime"   , 1   ],
]);

var AllpassL = defineFilterUGen("AllpassL", [
  [ "maxDelayTime", 0.2 ],
  [ "delayTime"   , 0.2 ],
  [ "decayTime"   , 1   ],
]);

var AllpassN = defineFilterUGen("AllpassN", [
  [ "maxDelayTime", 0.2 ],
  [ "delayTime"   , 0.2 ],
  [ "decayTime"   , 1   ],
]);

const propDefs = [
  [ "bufnum", 0 ],
];

function defineBufInfoUGen($type) {
  return defineUGen($type, propDefs, {
    rates: { kr: "control", ir: "scalar" },
    defaultRate: "control"
  });
}

var BufChannels = defineBufInfoUGen("BufChannels");

var BufDur = defineBufInfoUGen("BufDur");

var BufFrames = defineBufInfoUGen("BufFrames");

var BufRateScale = defineBufInfoUGen("BufRateScale");

var BufRd = defineUGen("BufRd", [
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

var BufSampleRate = defineBufInfoUGen("BufSampleRate");

var BufSamples = defineBufInfoUGen("BufSamples");

var BufWr = defineUGen("BufWr", [
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

var CombC = defineFilterUGen("CombC", [
  [ "maxDelayTime", 0.2 ],
  [ "delayTime"   , 0.2 ],
  [ "decayTime"   , 1   ],
]);

var CombL = defineFilterUGen("CombL", [
  [ "maxDelayTime", 0.2 ],
  [ "delayTime"   , 0.2 ],
  [ "decayTime"   , 1   ],
]);

var CombN = defineFilterUGen("CombN", [
  [ "maxDelayTime", 0.2 ],
  [ "delayTime"   , 0.2 ],
  [ "decayTime"   , 1   ],
]);

var DelayC = defineFilterUGen("DelayC", [
  [ "maxDelayTime", 0.2 ],
  [ "delayTime"   , 0.2 ],
]);

var DelayL = defineFilterUGen("DelayL", [
  [ "maxDelayTime", 0.2 ],
  [ "delayTime"   , 0.2 ],
]);

var DelayN = defineFilterUGen("DelayN", [
  [ "maxDelayTime", 0.2 ],
  [ "delayTime"   , 0.2 ],
]);

var Dust = defineUGen("Dust~", [
  [ "density", 0 ]
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "audio",
  madd: true,
});

function toArray(value) {
  return Array.isArray(value) ? value : [ value ];
}

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

var EnvGen = defineUGen("EnvGen", [
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

function createEnvNode(type, rate, [ env, gate, levelScale, levelBias, timeScale, action ]) {
  const envArray = toArray(toSCNodeInput(env));

  if (!checkEnvArray(envArray)) {
    throw new TypeError(`
      Invalid envelope parameters.
    `.trim());
  }

  return createNode(type, rate, [ gate, levelScale, levelBias, timeScale, action ].concat(envArray));
}

function checkEnvArray(envArray) {
  const nodeLength = envArray[1];

  if (envArray.length !== nodeLength * 4 + 4) {
    return false;
  }

  if (envArray.some(isNotValidInput$1)) {
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

function isNotValidInput$1(value) {
  return !(isNumner(value) || isSCNode(value));
}

var ExpRand = defineUGen("ExpRand~", [
  [ "lo", 0.01 ],
  [ "hi", 1    ],
], {
  rates: { new: "scalar" },
  defaultRate: "scalar",
});

var FreeVerb = defineFilterUGen("FreeVerb", [
  [ "mix" , 0.33 ],
  [ "room", 0.5  ],
  [ "dump", 0.5  ],
]);

var Impulse = defineUGen("Impulse", [
  [ "freq" , 440 ],
  [ "phase",   0 ]
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "audio",
  madd: true,
});

var In = defineUGen("In", [
  [ "bus"        , 0 ],
  [ "numChannels", 1 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "audio",
  multiOut: args => args.pop(),
});

var IRand = defineUGen("IRand~", [
  [ "lo",   0 ],
  [ "hi", 127 ],
], {
  rates: { new: "scalar" },
  defaultRate: "scalar",
});

var Klank = defineUGen("Klank", [
  [ "ref", 0 ],
  [ "in" , 0 ],
  [ "freqScale" , 1 ],
  [ "freqOffset", 0 ],
  [ "decayScale", 1 ],
], {
  rates: { ar: "audio" },
  defaultRate: "audio",
  createNode: createKlank,
});

function createKlank(type, rate, props) {
  const [ ref, in_, freqScale, freqOffset, decayScale ] = props;

  let [ freqs, amps, times ] = ref.valueOf();

  freqs = toArray(freqs);
  amps  = amps  != null ? toArray(amps ) : [ 1 ];
  times = times != null ? toArray(times) : [ 1 ];

  const length = Math.max(freqs.length, amps.length, times.length);
  const specs = Array.from({ length: length * 3 }, (_, i) => {
    return wrapAt([ freqs, amps, times ][i % 3], (i / 3)|0);
  });

  return createNode(type, rate, [ in_, freqScale, freqOffset, decayScale ].concat(specs));
}

var LFCub = defineUGen("LFCub", [
  [ "freq"  , 440 ],
  [ "iphase",   0 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "control",
  madd: true,
});

var LFNoise0 = defineUGen("LFNoise0~", [
  [ "freq", 500 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "control",
  madd: true,
});

var LFNoise1 = defineUGen("LFNoise1~", [
  [ "freq", 500 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "control",
  madd: true,
});

var LFNoise2 = defineUGen("LFNoise2~", [
  [ "freq", 500 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "control",
  madd: true,
});

var LFPar = defineUGen("LFPar", [
  [ "freq"  , 440 ],
  [ "iphase",   0 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "control",
  madd: true,
});

var LFPulse = defineUGen("LFPulse", [
  [ "freq"  , 440   ],
  [ "iphase",   0   ],
  [ "width" ,   0.5 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "control",
  madd: true,
});

var LFSaw = defineUGen("LFSaw", [
  [ "freq"  , 440 ],
  [ "iphase",   0 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "control",
  madd: true,
});

var LFTri = defineUGen("LFTri", [
  [ "freq"  , 440 ],
  [ "iphase",   0 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "control",
  madd: true,
});

var Line = defineUGen("Line", [
  [ "start",  1 ],
  [ "end"  ,  0 ],
  [ "dur"  ,  1 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "control",
  madd: true,
  action: true,
});

var MouseX = defineUGen("MouseX", [
  [ "min" , 0   ],
  [ "max" , 1   ],
  [ "warp", 0   ],
  [ "lag" , 0.2 ],
], {
  rates: { kr: "control" },
  defaultRate: "control",
});

var MouseY = defineUGen("MouseY", [
  [ "min" , 0   ],
  [ "max" , 1   ],
  [ "warp", 0   ],
  [ "lag" , 0.2 ],
], {
  rates: { kr: "control" },
  defaultRate: "control",
});

function createOutputNode(items) {
  const object = createNode(0, "scalar", toArray(items));

  Object.defineProperties(object, {
    valueOf: {
      value: () => 0,
      enumerable: false, writable: true, configurable: true
    },
  });

  return object;
}

function $$1($rate) {
  return (bus, inputs) => {
    return createOutputNode(flatten(multiMap([ bus ].concat(inputs), (bus, ...inputs) => {
      if ($rate === "audio" && !inputs.every(isAudioRateOrZero)) {
        throw new TypeError(`node[Out] required audio inputs.`);
      }
      return createNode("Out", $rate, [ bus ].concat(inputs));
    })));
  };
}

function flatten(list) {
  if (Array.isArray(list)) {
    return list.reduce((list, item) => {
      return list.concat(flatten(item));
    }, []);
  }
  return [ list ];
}

function isAudioRateOrZero(node) {
  return node === 0 || node.rate === "audio";
}

const fn = $$1("audio");

fn.ar = $$1("audio");
fn.kr = $$1("control");

var Pan2 = defineUGen("Pan2", [
  [ "in"   , 0 ],
  [ "pos"  , 0 ],
  [ "level", 1 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: null,
  createNode: checkInputs(0),
  multiOut: 2,
});

var Phasor = defineUGen("Phasor", [
  [ "trig" , 0 ],
  [ "rate" , 1 ],
  [ "start", 0 ],
  [ "end"  , 1 ],
  [ "reset", 0 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "audio",
});

var PinkNoise = defineUGen("PinkNoise~", [], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "audio",
  madd: true,
});

var PlayBuf = defineUGen("PlayBuf", [
  [ "numChannels", 1 ],
  [ "bufnum"     , 0 ],
  [ "rate"       , 1 ],
  [ "trig"       , 1 ],
  [ "startPos"   , 0 ],
  [ "loop"       , 0 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "audio",
  action: true,
  multiOut: args => args.shift(),
});

var Rand = defineUGen("Rand~", [
  [ "lo", 0 ],
  [ "hi", 1 ],
], {
  rates: { new: "scalar" },
  defaultRate: "scalar",
});

var RHPF = defineFilterUGen("RHPF", [
  [ "freq", 440 ],
  [ "rq"  ,   1 ],
]);

var RLPF = defineFilterUGen("RLPF", [
  [ "freq", 440 ],
  [ "rq"  ,   1 ],
]);

var SinOsc = defineUGen("SinOsc", [
  [ "freq" , 440 ],
  [ "phase",   0 ]
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "audio",
  madd: true,
});

var SinOscFB = defineUGen("SinOscFB", [
  [ "freq"     , 440 ],
  [ "fee,dback",   0 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "audio",
  madd: true,
});

var TExpRand = defineUGen("TExpRand~", [
  [ "lo"  , 0.01 ],
  [ "hi"  , 1    ],
  [ "trig", 0    ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "control",
});

var TIRand = defineUGen("TIRand~", [
  [ "lo"  ,   0 ],
  [ "hi"  , 127 ],
  [ "trig",   0 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "control",
});

var TRand = defineUGen("TRand~", [
  [ "lo"  , 0 ],
  [ "hi"  , 1 ],
  [ "trig", 0 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "control",
});

var WhiteNoise = defineUGen("WhiteNoise~", [], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "audio",
  madd: true,
});

var XLine = defineUGen("XLine", [
  [ "start",  1    ],
  [ "end"  ,  0.01 ],
  [ "dur"  ,  1    ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "control",
  madd: true,
  action: true,
});



var units = Object.freeze({
	AllpassC: AllpassC,
	AllpassL: AllpassL,
	AllpassN: AllpassN,
	BufChannels: BufChannels,
	BufDur: BufDur,
	BufFrames: BufFrames,
	BufRateScale: BufRateScale,
	BufRd: BufRd,
	BufSampleRate: BufSampleRate,
	BufSamples: BufSamples,
	BufWr: BufWr,
	CombC: CombC,
	CombL: CombL,
	CombN: CombN,
	DelayC: DelayC,
	DelayL: DelayL,
	DelayN: DelayN,
	Dust: Dust,
	Env: Env,
	EnvGen: EnvGen,
	ExpRand: ExpRand,
	FreeVerb: FreeVerb,
	Impulse: Impulse,
	In: In,
	IRand: IRand,
	Klank: Klank,
	LFCub: LFCub,
	LFNoise0: LFNoise0,
	LFNoise1: LFNoise1,
	LFNoise2: LFNoise2,
	LFPar: LFPar,
	LFPulse: LFPulse,
	LFSaw: LFSaw,
	LFTri: LFTri,
	Line: Line,
	MouseX: MouseX,
	MouseY: MouseY,
	Out: fn,
	Pan2: Pan2,
	Phasor: Phasor,
	PinkNoise: PinkNoise,
	PlayBuf: PlayBuf,
	Rand: Rand,
	RHPF: RHPF,
	RLPF: RLPF,
	SinOsc: SinOsc,
	SinOscFB: SinOscFB,
	TExpRand: TExpRand,
	TIRand: TIRand,
	TRand: TRand,
	WhiteNoise: WhiteNoise,
	XLine: XLine
});

// done actions
const NO_ACTION                  =  0;
const PAUSE                      =  1;
const FREE                       =  2;
const FREE_AND_BEFORE            =  3;
const FREE_AND_AFTER             =  4;
const FREE_AND_GROUP_BEFORE      =  5;
const FREE_AND_GROUP_AFTER       =  6;
const FREE_UPTO_THIS             =  7;
const FREE_FROM_THIS_ON          =  8;
const FREE_PAUSE_BEFORE          =  9;
const FREE_PAUSE_AFTER           = 10;
const FREE_AND_GROUP_BEFORE_DEEP = 11;
const FREE_AND_GROUP_AFTER_DEEP  = 12;
const FREE_CHILDREN              = 13;
const FREE_GROUP                 = 14;


var constants = Object.freeze({
	NO_ACTION: NO_ACTION,
	PAUSE: PAUSE,
	FREE: FREE,
	FREE_AND_BEFORE: FREE_AND_BEFORE,
	FREE_AND_AFTER: FREE_AND_AFTER,
	FREE_AND_GROUP_BEFORE: FREE_AND_GROUP_BEFORE,
	FREE_AND_GROUP_AFTER: FREE_AND_GROUP_AFTER,
	FREE_UPTO_THIS: FREE_UPTO_THIS,
	FREE_FROM_THIS_ON: FREE_FROM_THIS_ON,
	FREE_PAUSE_BEFORE: FREE_PAUSE_BEFORE,
	FREE_PAUSE_AFTER: FREE_PAUSE_AFTER,
	FREE_AND_GROUP_BEFORE_DEEP: FREE_AND_GROUP_BEFORE_DEEP,
	FREE_AND_GROUP_AFTER_DEEP: FREE_AND_GROUP_AFTER_DEEP,
	FREE_CHILDREN: FREE_CHILDREN,
	FREE_GROUP: FREE_GROUP
});

var scapi = Object.assign({}, api, operators, units, constants);

// rate
const SCALAR  = 0;
const CONTROL = 1;
const AUDIO   = 2;
const DEMAND  = 3;


var constants$1 = Object.freeze({
	SCALAR: SCALAR,
	CONTROL: CONTROL,
	AUDIO: AUDIO,
	DEMAND: DEMAND
});

const major  = [ 0, 4, 7 ];
const minor  = [ 0, 3, 7 ];
const major7 = [ 0, 4, 7, 11 ];
const dom7   = [ 0, 4, 7, 10 ];
const minor7 = [ 0, 3, 7, 10 ];
const aug    = [ 0, 4, 8 ];
const dim    = [ 0, 3, 6 ];
const dim7   = [ 0, 3, 6, 9 ];

const CHORD = {
  "1"     : [ 0 ],
  "5"     : [ 0, 7 ],
  "+5"    : [ 0, 4, 8 ],
  "m+5"   : [ 0, 3, 8 ],
  "sus2"  : [ 0, 2, 7 ],
  "sus4"  : [ 0, 5, 7 ],
  "6"     : [ 0, 4, 7, 9 ],
  "m6"    : [ 0, 3, 7, 9 ],
  "7sus2" : [ 0, 2, 7, 10 ],
  "7sus4" : [ 0, 5, 7, 10 ],
  "7-5"   : [ 0, 4, 6, 10 ],
  "m7-5"  : [ 0, 3, 6, 10 ],
  "7+5"   : [ 0, 4, 8, 10 ],
  "m7+5"  : [ 0, 3, 8, 10 ],
  "9"     : [ 0, 4, 7, 10, 14 ],
  "m9"    : [ 0, 3, 7, 10, 14 ],
  "m7+9"  : [ 0, 3, 7, 10, 14 ],
  "maj9"  : [ 0, 4, 7, 11, 14 ],
  "9sus4" : [ 0, 5, 7, 10, 14 ],
  "6*9"   : [ 0, 4, 7, 9, 14 ],
  "m6*9"  : [ 0, 3, 9, 7, 14 ],
  "7-9"   : [ 0, 4, 7, 10, 13 ],
  "m7-9"  : [ 0, 3, 7, 10, 13 ],
  "7-10"  : [ 0, 4, 7, 10, 15 ],
  "9+5"   : [ 0, 10, 13 ],
  "m9+5"  : [ 0, 10, 14 ],
  "7+5-9" : [ 0, 4, 8, 10, 13 ],
  "m7+5-9": [ 0, 3, 8, 10, 13 ],
  "11"    : [ 0, 4, 7, 10, 14, 17 ],
  "m11"   : [ 0, 3, 7, 10, 14, 17 ],
  "maj11" : [ 0, 4, 7, 11, 14, 17 ],
  "11+"   : [ 0, 4, 7, 10, 14, 18 ],
  "m11+"  : [ 0, 3, 7, 10, 14, 18 ],
  "13"    : [ 0, 4, 7, 10, 14, 17, 21 ],
  "m13"   : [ 0, 3, 7, 10, 14, 17, 21 ],
  "major" : major,
  "M"     : major,
  "minor" : minor,
  "m"     : minor,
  "major7": major7,
  "dom7"  : dom7,
  "7"     : dom7,
  "M7"    : major7,
  "minor7": minor7,
  "m7"    : minor7,
  "augmented": aug,
  "aug"   : aug,
  "a"     : aug,
  "diminished": dim,
  "dim"   : dim,
  "i"     : dim,
  "diminished7": dim7,
  "dim7"  : dim7,
  "i7"    : dim7,
};

function note(...args) {
  switch (args.length) {
  case 1:
    if (args[0] === null || Number.isFinite(args[0])) {
      // (noteNumber)
      return args[0];
    }
    if (typeof args[0] === "string") {
      // ("noteName(chordName)")
      if (args[0].includes("(")) {
        const [ noteName, chordName ] = args[0].split("(");

        return toChordNoteNumbers(toNoteNumber(noteName), chordName.slice(0, -1));
      }
      // ("noteName")
      if (/[a-g]/i.test(args[0].charAt(0))) {
        return toNoteNumber(args[0]);
      }

      // ("chordName")
      return toChordNoteNumbers(0, args[0], 0);
    }
    break;
  case 2:
    if (typeof args[1] === "string") {
      // (noteNumber, "chordName")
      return toChordNoteNumbers(note(args[0]), args[1], 0);
    }
    // (noteName|chordName, inversion)
    return invertChord(note(args[0]), args[1]|0);
  case 3:
    // array.map?
    if (typeof args[1] === "number" && Array.isArray(args[2])) {
      return note(args[0]);
    }
    // (noteNumber, chordName, inversion)
    return invertChord(toChordNoteNumbers(note(args[0]), args[1]), args[2]);
  }

  throw new TypeError(`
    failed to parse note notation
  `.trim());
}

function toNoteNumber(noteName) {
  let noteNumber;

  noteNumber = [ 9, 11, 0, 2, 4, 5, 7 ][noteName.toLowerCase().charCodeAt(0) - 97];

  if (noteName.length !== 1) {
    noteNumber += { "-": -1, "+": +1, "b": -1, "#": +1 }[noteName.charAt(1)]|0;
    noteNumber += (noteName.charAt(noteName.length - 1)|0) * 12 + 12;
  }

  return noteNumber;
}

function toChordNoteNumbers(noteNumber, chordName) {
  const nums = CHORD[chordName];

  if (Array.isArray(nums)) {
    return nums.map(i => i + noteNumber);
  }

  throw new TypeError(`
    failed to parse note notation
  `.trim());
}

function invertChord(noteNumbers, inversion) {
  if (inversion === 0) {
    return noteNumbers;
  } else if (0 < inversion) {
    while (inversion--) {
      noteNumbers.push(noteNumbers.shift() + 12);
    }
  } else {
    while (inversion++) {
      noteNumbers.unshift(noteNumbers.pop() - 12);
    }
  }
  return noteNumbers;
}

function arp(noteNumbers, style, length = -1, distance = 0) {
  if (typeof noteNumbers === "string") {
    noteNumbers = note(noteNumbers);
  }

  const indices = arpIndex(style, noteNumbers.length);

  if (length === -1) {
    length = indices.length;
  }

  return Array.from({ length }, (_, index) => {
    const i = Math.floor(index % indices.length);
    const j = Math.floor(index / indices.length);

    return noteNumbers[indices[i]] + j * distance;
  });
}

function arpIndex(style, length) {
  switch (style.toLowerCase()) {
  case "up":
    return Array.from({ length }, (_, i) => i);
  case "down":
    return Array.from({ length }, (_, i) => length - i - 1);
  case "updown":
    return arpIndex("up", length).concat(arpIndex("down", length).slice(1, -1));
  case "downup":
    return arpIndex("down", length).concat(arpIndex("up", length).slice(1, -1));
  case "up&down":
    return arpIndex("up", length).concat(arpIndex("down", length));
  case "down&up":
    return arpIndex("down", length).concat(arpIndex("up", length));
  case "converge":
    return Array.from({ length }, (_, i) => {
      return i % 2 ? length - Math.floor(i / 2) - 1 : i / 2;
    });
  case "diverge":
    return arpIndex("converge", length).reverse();
  case "con&diverge":
    return arpIndex("converge", length).concat(arpIndex("diverge", length).slice(1, -1));
  case "pinky up":
    return Array.from({ length: length * 2 - 2 }, (_, i) => {
      return i % 2 ? length - 1 : i / 2;
    });
  case "pinky updown":
    return arpIndex("pinky up", length).concat(arpIndex("pinky up", length).reverse().slice(3, -1));
  case "thumb up":
    return Array.from({ length: length * 2 - 2 }, (_, i) => {
      return i % 2 ? Math.ceil(i / 2) : 0;
    });
  case "thumb updown":
    return arpIndex("thumb up", length).concat(arpIndex("thumb up", length).reverse().slice(1, -3));
  }
  throw new TypeError(`
    unknown arp style: '${ style }'
  `.trim());
}



var musicAPI = Object.freeze({
	arp: arp,
	note: note
});

function isGenFunc(value) {
  return typeof value === "function" && value.constructor.name === "GeneratorFunction";
}

function toGenFuncIfNeeded(value) {
  if (isGenFunc(value)) {
    return value;
  }
  return function*() {
    while (true) { yield value; }
  }
}

function zip(...args) {
  return function*() {
    const iters = args.map(p => toGenFuncIfNeeded(p)());

    while (true) {
      const values = iters.map(iter => iter.next());

      if (values.some(({ done }) => done)) {
        break;
      }

      yield values.map(({ value }) => value);
    }
  };
}

function pchunk(p, n = 1) {
  p = toGenFuncIfNeeded(p);
  n = toGenFuncIfNeeded(n);

  return defineChainMethods(function*() {
    const piter = p();
    const niter = n();

    loop: while (true) {
      for (const n of niter) {
        const items = takeN(piter, n);

        if (items.length === 0) {
          break loop;
        }

        yield items;

        if (items.length < n) {
          break loop;
        }
      }

      break loop;
    }
  });
}

function takeN(iter, n) {
  const items = [];

  for (let i = 0; i < n; i++) {
    const { value, done } = iter.next();

    if (done) {
      break;
    }

    items.push(value);
  }

  return items;
}

function* nextValue(value) {
  if (isGenFunc(value)) {
    yield* value();
  } else {
    yield value;
  }
}

function pcombine(...args) {
  const fn = args.pop();
  const p = zip(...args);

  return defineChainMethods(function*() {
    for (const values of p()) {
      yield* nextValue(fn(...values));
    }
  });
}

function pconcat(...args) {
  return defineChainMethods(function*() {
    for (const p of args) {
      for (const value of p()) {
        yield value;
      }
    }
  });
}

function pdrop(p, length = 1) {
  return defineChainMethods(function*() {
    let i = 0;
    for (const value of p()) {
      if (length <= i++) {
        yield value;
      }
    }
  });
}

function* enumerate(iter) {
  let index = 0;
  for (const value of iter) {
    yield [ index++, value];
  }
}

function toFilterGenFunc(fn) {
  if (isGenFunc(fn)) {
    return function*() {
      for (const value of fn()) {
        yield () => value;
      }
    };
  }

  return function*() {
    while (true) { yield fn; }
  };
}

function pfilter(p, fn) {
  p = zip(p, toFilterGenFunc(fn));

  return defineChainMethods(function*() {
    const iter = p();

    for (const [ index, [ value, fn ]] of enumerate(iter)) {
      if (fn(value, index, iter)) {
        yield value;
      }
    }
  });
}

function place(...args) {
  const p = zip(...args);

  return defineChainMethods(function*() {
    for (const values of p()) {
      for (const value of values) {
        yield value;
      }
    }
  });
}

function plength(p, length = 1) {
  return defineChainMethods(function*() {
    let i = 0;
    while (i < length) {
      for (const value of p()) {
        yield value;
        if (length <= ++i) {
          break;
        }
      }
    }
  });
}

function ploop(p) {
  return defineChainMethods(function*() {
    while (true) {
      for (const value of p()) {
        yield value;
      }
    }
  });
}

function pmap(p, fn) {
  return defineChainMethods(function*() {
    const iter = p();

    for (const [ index, value ] of enumerate(iter)) {
      yield* nextValue(fn(value, index, iter));
    }
  });
}

function preject(p, fn) {
  p = zip(p, toFilterGenFunc(fn));

  return defineChainMethods(function*() {
    const iter = p();

    for (const [ index, [ value, fn ] ] of enumerate(iter)) {
      if (!fn(value, index, iter)) {
        yield value;
      }
    }
  });
}

function pscan(p, fn, prev = 0) {
  return defineChainMethods(function*() {
    const iter = p();

    for (const [ index, value ] of enumerate(iter)) {
      yield* nextValue(prev = fn(prev, value, index, iter));
    }
  });
}

function pstutter(p, n = 2) {
  p = zip(p, n);

  return defineChainMethods(function*() {
    for (const [ value, repeats ] of p()) {
      for (let i = 0; i < repeats; i++) {
        yield value;
      }
    }
  });
}

function psub(p, fn, replacement) {
  p = zip(p, toFilterGenFunc(fn));

  return defineChainMethods(function*() {
    const iter = p();

    for (const [ index, [ value, fn ] ] of enumerate(iter)) {
      if (fn(value, index, iter)) {
        yield value;
      } else if (typeof replacement !== "undefined") {
        yield* nextValue(replacement);
      }
    }
  });
}

function ptake(p, length = 1) {
  return defineChainMethods(function*() {
    let i = 0;
    for (const value of p()) {
      if (i++ < length) {
        yield value;
      } else {
        break;
      }
    }
  });
}

function puntil(p, cond) {
  p = zip(p, toFilterGenFunc(cond));

  return defineChainMethods(function*() {
    const iter = p();

    for (const [ index, [ value, cond ] ] of enumerate(iter)) {
      if (cond(value, index, iter)) {
        break;
      }
      yield value;
    }
  });
}

function pwhile(p, cond) {
  p = zip(p, toFilterGenFunc(cond));

  return defineChainMethods(function*() {
    const iter = p();

    for (const [ index, [ value, cond ] ] of enumerate(iter)) {
      if (!cond(value, index, iter)) {
        break;
      }
      yield value;
    }
  });
}

var pzip = function(...args) {
  return defineChainMethods(zip(...args));
};

function defineChainMethods(p) {
  defineChainMethod(p, "chunk"  , pchunk);
  defineChainMethod(p, "combine", pcombine);
  defineChainMethod(p, "concat" , pconcat);
  defineChainMethod(p, "drop"   , pdrop);
  defineChainMethod(p, "filter" , pfilter);
  defineChainMethod(p, "lace"   , place);
  defineChainMethod(p, "length" , plength);
  defineChainMethod(p, "loop"   , ploop);
  defineChainMethod(p, "map"    , pmap);
  defineChainMethod(p, "reject" , preject);
  defineChainMethod(p, "scan"   , pscan);
  defineChainMethod(p, "stutter", pstutter);
  defineChainMethod(p, "sub"    , psub);
  defineChainMethod(p, "take"   , ptake);
  defineChainMethod(p, "until"  , puntil);
  defineChainMethod(p, "while"  , pwhile);
  defineChainMethod(p, "zip"    , pzip);
  return p;
}

function defineChainMethod(p, name, fn) {
  Object.defineProperty(p, name, {
    value: (...args) => fn(p, ...args),
    enumerable: false, writable: true, configurable: true
  });
}

function parp(noteNumbers, style, length = -1, distance = 0) {
  const p = zip(noteNumbers, style, length, distance);

  return defineChainMethods(function*() {
    for (const [ noteNumbers, style, length, distance ] of p()) {
      for (const value of arp(noteNumbers, style, length, distance)) {
        yield value;
      }
    }
  });
}

function pcount(offset = 0, length = Infinity) {
  return defineChainMethods(function*() {
    for (let i = 0; i < length; i++) {
      yield i + offset;
    }
  });
}

const api$1 = { random: Math.random };

function pirand(lo = 0.01, hi = 1, repeats = Infinity) {
  return defineChainMethods(function*() {
    for (let i = 0; i < repeats; i++) {

      yield lo * Math.exp(api$1.random() * Math.log(hi / lo));
    }
  });
}

function pfunc(fn, repeats = Infinity) {
  return defineChainMethods(function*() {
    for (let i = 0; i < repeats; i++) {
      yield* nextValue(fn(i, repeats));
    }
  });
}

const api$2 = { random: Math.random };

function pirand$1(lo = 0, hi = 127, repeats = Infinity) {
  return defineChainMethods(function*() {
    for (let i = 0; i < repeats; i++) {
      yield Math.floor(api$2.random() * (hi - lo) + lo);
    }
  });
}

const api$3 = { random: Math.random };

function prand(lo = 0, hi = 1, repeats = Infinity) {
  return defineChainMethods(function*() {
    for (let i = 0; i < repeats; i++) {
      yield api$3.random() * (hi - lo) + lo;
    }
  });
}

const api$4 = { random: Math.random };

function psample(list, length = list.length) {
  return defineChainMethods(function*() {
    for (let i = 0; i < length; i++) {
      yield* nextValue(randAt(list));
    }
  });
}

function randAt(list) {
  return list[(api$4.random() * list.length)|0];
}

function pseq(list, repeats = 1) {
  return defineChainMethods(function*() {
    for (let i = 0; i < repeats; i++) {
      for (const value of list) {
        yield* nextValue(value);
      }
    }
  });
}



var patternAPI = Object.freeze({
	parp: parp,
	pchunk: pchunk,
	pcombine: pcombine,
	pconcat: pconcat,
	pcount: pcount,
	pdrop: pdrop,
	pexprand: pirand,
	pfilter: pfilter,
	pfunc: pfunc,
	pirand: pirand$1,
	place: place,
	plength: plength,
	ploop: ploop,
	pmap: pmap,
	prand: prand,
	preject: preject,
	psample: psample,
	pscan: pscan,
	pseq: pseq,
	pstutter: pstutter,
	psub: psub,
	ptake: ptake,
	puntil: puntil,
	pwhile: pwhile,
	pzip: pzip
});

var domain;

// This constructor is used to store event handlers. Instantiating this is
// faster than explicitly calling `Object.create(null)` to get a "clean" empty
// object (tested with v8 v4.9).
function EventHandlers() {}
EventHandlers.prototype = Object.create(null);

function EventEmitter() {
  EventEmitter.init.call(this);
}
// nodejs oddity
// require('events') === require('events').EventEmitter
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.usingDomains = false;

EventEmitter.prototype.domain = undefined;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

EventEmitter.init = function() {
  this.domain = null;
  if (EventEmitter.usingDomains) {
    // if there is an active domain, then attach to it.
    if (domain.active && !(this instanceof domain.Domain)) {
      this.domain = domain.active;
    }
  }

  if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
    this._events = new EventHandlers();
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events, domain;
  var needDomainExit = false;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  domain = this.domain;

  // If there is no 'error' event listener then throw.
  if (doError) {
    er = arguments[1];
    if (domain) {
      if (!er)
        er = new Error('Uncaught, unspecified "error" event');
      er.domainEmitter = this;
      er.domain = domain;
      er.domainThrown = false;
      domain.emit('error', er);
    } else if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
    // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
    // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  if (needDomainExit)
    domain.exit();

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = new EventHandlers();
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] :
                                          [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
                            existing.length + ' ' + type + ' listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        emitWarning(w);
      }
    }
  }

  return target;
}
function emitWarning(e) {
  typeof console.warn === 'function' ? console.warn(e) : console.log(e);
}
EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function _onceWrap(target, type, listener) {
  var fired = false;
  function g() {
    target.removeListener(type, g);
    if (!fired) {
      fired = true;
      listener.apply(target, arguments);
    }
  }
  g.listener = listener;
  return g;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || (list.listener && list.listener === listener)) {
        if (--this._eventsCount === 0)
          this._events = new EventHandlers();
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length; i-- > 0;) {
          if (list[i] === listener ||
              (list[i].listener && list[i].listener === listener)) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (list.length === 1) {
          list[0] = undefined;
          if (--this._eventsCount === 0) {
            this._events = new EventHandlers();
            return this;
          } else {
            delete events[type];
          }
        } else {
          spliceOne(list, position);
        }

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = new EventHandlers();
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = new EventHandlers();
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        for (var i = 0, key; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = new EventHandlers();
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        do {
          this.removeListener(type, listeners[listeners.length - 1]);
        } while (listeners[0]);
      }

      return this;
    };

EventEmitter.prototype.listeners = function listeners(type) {
  var evlistener;
  var ret;
  var events = this._events;

  if (!events)
    ret = [];
  else {
    evlistener = events[type];
    if (!evlistener)
      ret = [];
    else if (typeof evlistener === 'function')
      ret = [evlistener.listener || evlistener];
    else
      ret = unwrapListeners(evlistener);
  }

  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, i) {
  var copy = new Array(i);
  while (i--)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

class NeuObject {
  constructor(context) {
    Object.defineProperties(this, {
      context: desc(context),
      _: desc(Object.create(null)),
    });
    this._.emitter = new EventEmitter();
  }

  on(eventName, listener) {
    this._.emitter.on(eventName, listener);
    return this;
  }

  once(eventName, listener) {
    this._.emitter.once(eventName, listener);
    return this;
  }

  addListener(eventName, listener) {
    this._.emitter.addListener(eventName, listener);
    return this;
  }

  removeListener(eventName, listener) {
    this._.emitter.removeListener(eventName, listener);
    return this;
  }

  removeAllListeners(eventName) {
    this._.emitter.removeAllListeners(eventName);
    return this;
  }

  emit(eventName, ...args) {
    this._.emitter.emit(eventName, ...args);
    return this;
  }
}

function desc(value) {
  return {
    value, enumerable: false, writable: true, configurable: true
  };
}

const { In: In$1 } = scapi;

class NeuBus extends NeuObject {
  constructor(context, rate, index$$1, length) {
    super(context);

    this.rate = rate;
    this.index = index$$1;
    this.length = length;
  }

  get in() {
    if (this.rate === AUDIO) {
      return In$1.ar(this.index, this.length);
    }
    return In$1.kr(this.index, this.length);
  }

  set value(value) {
    this.set(value);
  }

  set(value) {
    if (this.rate === AUDIO) {
      throw new TypeError(`
        AudioBus cannot set value.
      `.trim());
    }

    const { context } = this;
    const cmd = context.commands.c_set(this.index, value);

    context.sendOSC(cmd);

    return this;
  }

  setAt(index$$1, value) {
    if (this.rate === AUDIO) {
      throw new TypeError(`
        AudioBus cannot set value.
      `.trim());
    }

    if (!(0 <= index$$1 && index$$1 < this.length)) {
      throw new TypeError(`
        Control index out of range.
      `.trim());
    }

    const { context } = this;
    const cmd = context.commands.c_set(this.index + index$$1, value);

    context.sendOSC(cmd);

    return this;
  }
}

class NeuBusAllocator extends NeuObject {
  constructor(context, rate, length = 1024, offset = 0) {
    super(context);

    this.rate = rate;
    this.length = length;
    this.offset = offset;
    this._.mem = new Uint8Array(length - offset);
    this._.pos = 0;
  }

  alloc(length) {
    const pos = this._findAvailablePos(this._.pos, length);

    if (pos === -1) {
      throw new Error(`
        BusIndexAllocator Error
      `.trim());
    }

    for (let i = 0; i < length; i++) {
      this._.mem[pos + i] = 1;
    }
    this._.pos = pos + length;

    const rate = this.rate;
    const index = pos + this.offset;

    return new NeuBus(this.context, rate, index, length);
  }

  free({ index, length }) {
    const pos = index - this.offset;

    for (let i = 0; i < length; i++) {
      this._.mem[pos + i] = 0;
    }
  }

  _findAvailablePos(startIndex, length) {
    const mem = this._.mem;

    loop: for (let i = 0, imax = mem.length - length; i < imax; i++) {
      const pos = (startIndex + i) % mem.length;

      for (let j = 0; j < length; j++) {
        if (mem[pos + j]) {
          i += j;
          continue loop;
        }
      }

      return pos;
    }

    return -1;
  }
}

class NeuBuffer extends NeuObject {
  static create(context, ...args) {
    return new NeuBuffer(...bindArgs(context, args));
  }

  constructor(context, bufId, numberOfChannels, length, source) {
    super(context);

    this.bufId = bufId;
    this.numberOfChannels = numberOfChannels;
    this.length = length;
    this.source = source;

    this._.state = "loading";

    const callback = ({ numberOfChannels, length, sampleRate }) => {
      this.numberOfChannels = numberOfChannels;
      this.length = length;
      this.sampleRate = sampleRate;
      /* istanbul ignore else */
      if (this._.state === "loading") {
        this._.state = "loaded";
      }
      this.emit("created", this);
      context.apiEmit("buffer-created", this);
    };

    if (source == null) {
      this.sampleRate = context.sampleRate;
      context.allocBuffer(bufId, numberOfChannels, length, callback);
    } else {
      this.sampleRate = 0;
      context.loadBuffer(bufId, source, callback);
    }
  }

  get state() {
    return this._.state;
  }

  free() {
    const { context } = this;
    const cmd = context.commands.b_free(this.bufId);

    context.sendOSC(cmd, () => {
      this.emit("disposed", this);
      context.apiEmit("buffer-disposed", this);
    });

    this._.state = "disposed";

    return this;
  }

  toSCNodeInput() {
    return this.bufId;
  }
}

function bindArgs(context, args) {
  const hasSource = typeof args[args.length - 1] === "string";

  switch (args.length) {
  case 1:
    // (source)
    if (hasSource) {
      return [ context, context.nextBufId(), 0, 0, args[0] ];
    }
    // (length)
    if (typeof args[0] === "number") {
      return [ context, context.nextBufId(), 1, args[0], null ];
    }
    break;
  case 2:
    // (bufId, source)
    if (hasSource) {
      return [ context, args[0], 0, 0, args[1] ];
    }
    // (numberOfChannels, length)
    if (typeof args[0] === "number" && typeof args[1] === "number") {
      return [ context, context.nextBufId(), args[0], args[1], null ];
    }
    break;
  case 3:
    // (bufId, numberOfChannels, length)
    if (typeof args[0] === "number" && typeof args[1] === "number" && typeof args[2] === "number") {
      return [ context, args[0], args[1], args[2], null ];
    }
    break;
  }
  throw TypeError(`
    Provided parameters for Buffer constructor is invalid.
  `.trim());
}

function isPlainObject$1(value) {
  return !!(value && Object.getPrototypeOf(value) === Object.prototype);
}

function isSDefJSON(value) {
  return !!(value && typeof value.name === "string" && Array.isArray(value.units));
}

const TYPE = 0;
const RATE = 1;
const SPECIAL_INDEX = 2;
const INPUTS = 3;
const OUTPUTS = 4;

function sdefAnalyze(sdef) {
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

const SpecialIndexDict = Object.create(null);

`
neg not isNil notNil bitNot abs asFloat asInt ceil floor frac sign squared cubed sqrt exp reciprocal
midicps cpsmidi midiratio ratiomidi dbamp ampdb octcps cpsoct log log2 log10 sin cos tan asin acos
atan sinh cosh tanh rand rand2 linrand bilinrand sum3rand distort softclip coin digitvalue silence
thru rectWindow hanWindow welWindow triWindow ramp scurve
`.trim().split(/\s+/).map((name, index) => {
  SpecialIndexDict[name] = [ "UnaryOpUGen", index ];
});

`
+ - * // / % == != < > <= >= min max & | ^ lcm gcd round roundUp trunc atan2 hypot
hypotApx pow << >> >>> fill ring1 ring2 ring3 ring4 difsqr sumsqr
sqrsum sqrdif absdif thresh amclip scaleneg clip2 excess fold2 wrap2 firstArg rrand exprand
`.trim().split(/\s+/).map((name, index) => {
  SpecialIndexDict[name] = [ "BinaryOpUGen", index ];
});

function fromType(type) {
  if (SpecialIndexDict[type]) {
    return SpecialIndexDict[type];
  }
  return [ type, 0 ];
}

function build(name, nodes, ctls) {
  const builder = new SDefBuilder();

  nodes.forEach((node) => {
    builder.collect(node);
  });

  const { consts, units, controls } = builder;
  const { paramValues, paramIndices } = buildParams(controls);

  const sdef = {};

  sdef.name = name;
  sdef.consts = consts;

  if (paramValues.length !== 0) {
    sdef.paramValues = paramValues;
    sdef.paramIndices = sortBy(paramIndices, ctls);
  }

  sdef.units = units;

  return sdef;
}

function sortBy(paramIndices, ctls) {
  return ctls ? paramIndices.sort((a, b) => {
    a = ctls.includes(a.name) ? ctls.indexOf(a.name) : Infinity;
    b = ctls.includes(b.name) ? ctls.indexOf(b.name) : Infinity;
    return a - b;
  }) : paramIndices;
}

class SDefBuilder {
  constructor() {
    this.consts = [];
    this.units = [];
    this.controls = {};

    this._keyToNodeMap = new Map();
    this._nodeToInputsMap = new Map();
    this._nameToCtrlMap = new Map();
  }

  collect(node) {
    if (this.isKnownNode(node)) {
      return;
    }
    if (typeof node === "number") {
      return this.collectNumber(node);
    }
    if (node.type[0] === "#" || node.type[0] === "!") {
      return this.collectControl(node);
    }
    if (node.type === 0) {
      return this.collectOutput(node);
    }
    if (node.type === "OutputProxy") {
      return this.collectOutputProxy(node);
    }
    return this.collectBasicNode(node, 1);
  }

  collectNumber(node) {
    this.setInputs(node, [ -1, this.consts.length ]);

    this.consts.push(node);
  }

  collectControl(node) {
    if (this.findSameInputsAndRegister(node)) {
      return;
    }

    const selector = toControlStrRate(node);

    if (!this.controls[selector]) {
      this.controls[selector] = {
        unit: null, index: -1, values: [], indices: {}
      };
    }

    const ctrl = this.controls[selector];
    const type = toControlType(selector);
    const name = node.type.slice(1);
    const [ value, index, length ] = node.props;

    if (this._nameToCtrlMap.has(name)) {
      if (this._nameToCtrlMap.get(name) !== ctrl) {
        throw createControlError(node);
      }
    } else {
      this._nameToCtrlMap.set(name, ctrl);
    }

    const { values, indices } = ctrl;

    if (indices.hasOwnProperty(name)) {
      if (indices[name].length !== length) {
        throw createControlError(node);
      }
    } else {
      indices[name] = { index: values.length, length };
    }

    const offset = indices[name].index;

    if (typeof values[index + offset] === "number") {
      throw createControlError(node);
    }

    values.length = Math.max(values.length, length);
    values[index + offset] = value;

    if (ctrl.unit === null) {
      ctrl.unit = [ type, toIntRate(node), 0, [], [] ];
      ctrl.index = this.units.length;
      this.units.push(ctrl.unit);
    }

    this.setInputs(node, [ ctrl.index, index + offset ]);
  }

  collectOutput(node) {
    node.props.forEach((node) => {
      this.collectBasicNode(node, 0);
    });
  }

  collectOutputProxy(node) {
    const [ source, index, length ] = node.props;

    if (this.isUnknownNode(source)) {
      this.collectBasicNode(source, length);
    }

    if (this.findSameInputsAndRegister(node)) {
      return;
    }

    this.setInputs(node, [ this.getInputs(source)[0], index ]);
  }

  collectBasicNode(node, length) {
    node.props.forEach((node) => {
      this.collect(node);
    });

    if (this.findSameInputsAndRegister(node)) {
      return;
    }

    this.setInputs(node, [ this.units.length, 0 ]);

    const [ type, specialIndex ] = fromType(node.type);
    const rate = toIntRate(node);
    const inputs = node.props.map(node => this.getInputs(node));
    const outputs = Array.from({ length }, () => rate);

    this.units.push([
      deuniq(type), rate, specialIndex, inputs, outputs
    ]);
  }

  findSameInputsAndRegister(node) {
    const key = this.createKeyFromNode(node);

    if (this.isUnknownKey(key)) {
      this.setNodeAtKey(key, node);
      return false;
    }

    this.setInputs(node, this.getInputs(this.getNodeAtKey(key)));

    return true;
  }

  createKeyFromNode(node) {
    if (typeof node === "number") {
      return "" + node;
    }

    if (this.isKnownNode(node)) {
      return JSON.stringify(this.getInputs(node));
    }

    if (node.type === "OutputProxy") {
      return toTypeDotRate(node) + " " + JSON.stringify([
        this.getInputs(node.props[0])[0], node.props[1]
      ]);
    }

    if (node.type[0] === "#" || node.type[1] === "!") {
      return toTypeDotRate(node) + " " + node.props.join(" ");
    }

    return toTypeDotRate(node) + " " + node.props.map((node) => {
      return this.createKeyFromNode(node);
    }).join(" ");
  }

  isUnknownKey(key) {
    return !this._keyToNodeMap.has(key);
  }

  setNodeAtKey(key, node) {
    this._keyToNodeMap.set(key, node);
  }

  getNodeAtKey(key) {
    return this._keyToNodeMap.get(key);
  }

  setInputs(node, inputs) {
    this._nodeToInputsMap.set(node, inputs);
  }

  getInputs(node) {
    return this._nodeToInputsMap.get(node);
  }

  isKnownNode(node) {
    return this._nodeToInputsMap.has(node);
  }

  isUnknownNode(node) {
    return !this._nodeToInputsMap.has(node);
  }
}

function buildParams(controls) {
  const paramValues = [];
  const paramIndices = [];

  Object.keys(controls).map((selector) => {
    return controls[selector];
  }).sort((a, b) => {
    return a.index - b.index;
  }).forEach(({ unit, values, indices }) => {
    const offset = paramValues.length;
    const length = values.length;

    paramValues.push(...values);

    Object.keys(indices).sort((a, b) => {
      return indices[a].index - indices[b].index;
    }).forEach((name) => {
      const index = indices[name].index + offset;
      const length = indices[name].length;

      paramIndices.push({ name, index, length });
    });

    unit[2] = offset;
    unit[4] = Array.from({ length }, () => unit[1]);
  });

  return { paramValues, paramIndices };
}

function createControlError(node) {
  const name = node.type.slice(1);

  return new TypeError(`
    Invalid control '${ name }'
  `.trim());
}

function deuniq(str) {
  return str.replace(/~\d+$/, "");
}

function toControlStrRate(node) {
  return node.type[0] === "!" ? "tr" : toStrRate(node);
}

function toControlType(rate) {
  return { ir: "Control", kr: "Control", ar: "AudioControl", tr: "TrigControl" }[rate];
}

function toTypeDotRate(node) {
  return node.type + "." + toStrRate(node);
}

function toStrRate(node) {
  return { demand: "dr", audio: "ar", control: "kr", scalar: "ir" }[node.rate];
}

function toIntRate(node) {
  return { demand: 3, audio: 2, control: 1, scalar: 0 }[node.rate];
}

var scdef = { build };

function parseFnArgs(fn) {
  const reComments = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;
  const fnStr = fn.toString().replace(reComments, "");
  const matched = fnStr.match(/^(?:async\s+)?([a-zA-Z_$][\w$]*)\s*=>?/);

  if (matched !== null) {
    return [ matched[1] ];
  }

  const args = [];
  let depth = 0;
  let token = "";
  let pos = fnStr.indexOf("(") + 1;

  function collectString(qt) {
    let token = "";

    while (pos < fnStr.length) {
      const ch = fnStr.charAt(pos++);

      token += ch;

      if (ch === "\\") {
        token += fnStr.charAt(pos++);
      } else if (ch === qt) {
        break;
      }
    }

    return token;
  }

  while (pos < fnStr.length) {
    const ch = fnStr.charAt(pos++);

    if (depth === 0) {
      if (ch === ")") {
        break;
      }
      if (ch === ",") {
        args.push(token.trim());
        token = "";
        continue;
      }
    }

    token += ch;

    switch (ch) {
    case "[": case "{": case "(":
      depth += 1;
      break;
    case "]": case "}": case ")":
      depth -= 1;
      break;
    case "'": case '"': case "`":
      token += collectString(ch);
      break;
    }
  }

  token = token.trim();

  if (token) {
    args.push(token);
  }

  return args;
}

const { ctl: ctl$2, In: In$2, Out } = scapi;

function sdefBuild(name, func, fnArgs) {
  if (fnArgs == null) {
    fnArgs = parseFnArgs(func);
  }

  const args = [];
  const ctls = [];
  const context = { inputs: [], outputs: [] };
  const $in = createInAPI(context);
  const $out = createOutAPI(context);

  fnArgs.forEach((item) => {
    const [ name, value ] = item.split("=").map(_ => _.trim());

    if (name === "$in") {
      args.push($in);
    } else if (name === "$out") {
      args.push($out);
    } else if (name === "$scapi" || name.charAt(0) === "{") {
      args.push(scapi);
    } else {
      const [ paramName, paramRate ] = name.split("$");
      const paramValue = value ? JSON.parse(value) : 0;

      args.push(createCtl(paramName, paramRate, paramValue));
      ctls.push(paramName);
    }
  });

  const node = func(...args);

  if (typeof node !== "undefined") {
    if (node.type === 0) {
      context.outputs.push(node);
    } else {
      $out(node);
    }
  }

  const outputs = context.outputs.filter((node) => {
    return node && node.type === 0;
  });

  return scdef.build("" + name, outputs, ctls);
}

function createCtl(name, rate, value) {
  switch (rate) {
  case "ar":
    return ctl$2.ar(name, value);
  case "ir":
    return ctl$2.ir(name, value);
  case "tr":
    return ctl$2.tr(name, value);
  default:
    return ctl$2.kr(name, value);
  }
}

function createInAPI({ inputs }) {
  function $(fn, numberOfChannels = 1) {
    const bus = ctl$2.ir("in");
    const in_ = fn(bus, numberOfChannels);

    bus.type += `:${ inputs.length }`;
    inputs.push(in_);

    return in_;
  }

  const $in = numberOfChannels => $(In$2.ar, numberOfChannels);

  $in.ar = numberOfChannels => $(In$2.ar, numberOfChannels);
  $in.kr = numberOfChannels => $(In$2.kr, numberOfChannels);

  return $in;
}

function createOutAPI({ outputs }) {
  function $(fn, node) {
    const bus = ctl$2.ir("out");
    const out = fn(bus, node);

    bus.type += `:${ outputs.length }`;
    outputs.push(out);

    return 0;
  }

  const $out = node => $(Out, node);

  $out.ar = node => $(Out.ar, node);
  $out.kr = node => $(Out.kr, node);

  return $out;
}

function sdefName(fn) {
  return fn.name || `temp-${ Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) }`;
}

class NeuSDef extends NeuObject {
  static create(context, ...args) {
    return new NeuSDef(...bindArgs$1(context, args));
  }

  constructor(context, sdef, opts = {}) {
    super(context);

    this.sdef = sdef;

    const meta = sdefAnalyze(sdef);

    this._.ctls = meta.ctls;
    this._.inputs = meta.inputs;
    this._.outputs = meta.outputs;
    this._.sendFlag = false;
    this._.doneDRecv = false;

    if (sdef.paramIndices) {
      this._.ctlNames = sdef.paramIndices.map(({ name }) => name).filter((name) => {
        return meta.ctls.hasOwnProperty(name);
      });
    } else {
      this._.ctlNames = [];
    }

    if (!opts.noSend) {
      this.send();
    }

    // not reigster when created by neu.synth(buildFn)
    if (!(opts.noRegister || sdef.name.startsWith("@@"))) {
      context.registerSDef(this);
    }
  }

  get name() {
    return this.sdef.name;
  }

  get ctlNames() {
    return this._.ctlNames;
  }

  get numberOfInputs() {
    return this._.inputs.length;
  }

  get numberOfOutputs() {
    return this._.outputs.length;
  }

  ctls(name) {
    return this._.ctls[name] || null;
  }

  inputs(n) {
    return this._.inputs[n|0] || null;
  }

  outputs(n) {
    return this._.outputs[n|0] || null;
  }

  free() {
    const { context } = this;
    const cmd = context.commands.d_free(this.name);

    context.sendOSC(cmd);
    context.unregisterSDef(this);

    return this;
  }

  send() {
    const { context } = this;

    if (!this._.sendFlag) {
      context.sendOSC(context.commands.d_recv(this.sdef), () => {
        this._.doneDRecv = true;
      });
      this._.sendFlag = true;
    }

    return this;
  }
}

function prependDRecvIfNeeded(inst, cmd) {
  if (inst._.doneDRecv) {
    return cmd;
  }
  return inst.context.commands.d_recv(inst.sdef, cmd);
}

function bindArgs$1(context, args) {
  switch (args.length) {
  case 1:
    // (sdef)
    if (isSDefJSON(args[0])) {
      return [ context, args[0], {} ];
    }
    // (buildFn)
    if (typeof args[0] === "function") {
      return bindArgs$1(context, [ sdefBuild(sdefName(args[0]), args[0]) ]);
    }
    break;
  case 2:
    // (sdef, opts)
    if (isSDefJSON(args[0]) && isPlainObject$1(args[1])) {
      return [ context, args[0], args[1] ];
    }
    // (name, buildFn)
    if (typeof args[0] === "string" && typeof args[1] === "function") {
      return bindArgs$1(context, [ sdefBuild(args[0], args[1]) ]);
    }
    // (buildFn, fnArgs)
    if (typeof args[0] === "function" && Array.isArray(args[1])) {
      return bindArgs$1(context, [ sdefBuild(sdefName(args[0]), args[0], args[1]) ]);
    }
    // (buildFn, opts)
    if (typeof args[0] === "function" && isPlainObject$1(args[1])) {
      return bindArgs$1(context, [ sdefBuild(sdefName(args[0]), args[0]), args[1] ]);
    }
    break;
  case 3:
    // (name, buildFn, fnArgs)
    if (typeof args[0] === "string" && typeof args[1] === "function" && Array.isArray(args[2])) {
      return bindArgs$1(context, [ sdefBuild(args[0], args[1], args[2]) ]);
    }
    // (name, buildFn, opts)
    if (typeof args[0] === "string" && typeof args[1] === "function" && isPlainObject$1(args[2])) {
      return bindArgs$1(context, [ sdefBuild(args[0], args[1]), args[2] ]);
    }
    break;
  case 4:
    // (name, buildFn, fnArgs, opts)
    if (typeof args[0] === "string" && typeof args[1] === "function" && Array.isArray(args[2]) && isPlainObject$1(args[3])) {
      return bindArgs$1(context, [ sdefBuild(args[0], args[1], args[2]), args[3] ]);
    }
    break;
  }
  throw TypeError(`
    Provided parameters for SDef constructor is invalid.
  `.trim());
}

class NeuNode extends NeuObject {
  constructor(context, nodeId) {
    super(context);

    this.nodeId = nodeId;
    this.isNode = true;
    this.ctl = new Proxy(this, ctlHandler);

    this._.state = "creating";

    context.registerNode(this);
  }

  get state() {
    return this._.state;
  }

  free() {
    const { context } = this;
    const cmd = context.commands.n_free(this.nodeId);

    context.sendOSC(cmd);
    context.unregisterNode(this);

    this._.state = "disposed";

    return this;
  }

  run(runFlag = true) {
    const { context } = this;
    const cmd = context.commands.n_run(this.nodeId, runFlag);

    context.sendOSC(cmd);

    return this;
  }

  apply(params) {
    const { context } = this;
    const xParams = [];
    const cParams = [];
    const aParams = [];

    Object.keys(params).forEach((name) => {
      const param = params[name];

      if (param instanceof NeuBus) {
        if (param.rate === AUDIO) {
          aParams.push(name, param.index);
        } else {
          cParams.push(name, param.index);
        }
      } else {
        xParams.push(name, param);
      }
    });

    const elements = [
      context.commands.n_set(this.nodeId, ...xParams),
      context.commands.n_map(this.nodeId, ...cParams),
      context.commands.n_mapa(this.nodeId, ...aParams),
    ].filter(cmd => cmd.args.length !== 1);

    let cmd;

    if (elements.length === 1) {
      cmd = elements[0];
    } else {
      cmd = { timetag: [ 0, 1 ], elements };
    }

    context.sendOSC(cmd);

    return this;
  }

  release(releaseTime) {
    if (releaseTime == null) {
      releaseTime = 0;
    } else {
      releaseTime = -1 * releaseTime - 1;
    }
    const { context } = this;
    const cmd = context.commands.n_set(this.nodeId, "gate", releaseTime);

    context.sendOSC(cmd);

    return this;
  }

  ["/n_go"]() {
    const { context } = this;

    this._.state = "running";

    this.emit("created", this);
    if (this.inst) {
      this.inst.emit("node-created", this);
      this.inst.sdef.emit("node-created", this);
    }
    context.apiEmit("node-created", this);
  }

  ["/n_end"]() {
    const { context } = this;

    if (this.inst) {
      this._.inputs.forEach((bus) => {
        this.context.freeBus(bus);
      });
      if (this.inst.sdefName.startsWith("@@")) {
        this.inst.sdef.free();
      }
    }

    this._.state = "disposed";
    context.unregisterNode(this);

    this.emit("disposed", this);
    if (this.inst) {
      this.inst.emit("node-disposed", this);
      this.inst.sdef.emit("node-disposed", this);
    }
    context.apiEmit("node-disposed", this);
  }

  ["/n_off"]() {
    const { context } = this;

    this._.state = "suspended";

    this.emit("statechanged", this);
    if (this.inst) {
      this.inst.emit("node-statechanged", this);
      this.inst.sdef.emit("node-statechanged", this);
    }
    context.apiEmit("node-statechanged", this);
  }

  ["/n_on"]() {
    const { context } = this;

    this._.state = "running";

    this.emit("statechanged", this);
    if (this.inst) {
      this.inst.emit("node-statechanged", this);
      this.inst.sdef.emit("node-statechanged", this);
    }
    context.apiEmit("node-statechanged", this);
  }
}

const ctlHandler = {
  set(target, name, value) {
    target.apply({ [name]: value });
    return true;
  }
};

class NeuInstrument extends NeuObject {
  static create(context, ...args) {
    return new NeuInstrument(...bindArgs$2(context, args));
  }

  constructor(context, sdef, params = null, target = null, action = null) {
    super(context);

    this.sdef = sdef;
    this._.params = params;
    this._.target = target;
    this._.action = action;
  }

  get sdefName() {
    return this.sdef.name;
  }

  get ctlNames() {
    return this.sdef.ctlNames;
  }

  get numberOfInputs() {
    return this.sdef.numberOfInputs;
  }

  get numberOfOutputs() {
    return this.sdef.numberOfOutputs;
  }

  get params() {
    return this._.params;
  }

  get target() {
    return this._.target;
  }

  get action() {
    return this._.action;
  }

  ctls(name) {
    return this.sdef.ctls(name);
  }

  inputs(n) {
    return this.sdef.inputs(n);
  }

  outputs(n) {
    return this.sdef.outputs(n);
  }
}

function bindArgs$2(context, args) {
  args[0] = toSDef(context, args[0]);

  if (args[0] instanceof NeuSDef) {
    switch (args.length) {
    case 1:
      // (sdef)
      return [ context, args[0], null, null, null ];
    case 2:
      // (sdef, params)
      if (isPlainObject$1(args[1])) {
        return [ context, args[0], args[1], null, null ];
      }
      // (sdef, target)
      if (args[1] instanceof NeuNode) {
        return [ context, args[0], null, args[1], null ];
      }
      break;
    case 3:
      // (sdef, params, target)
      if (isPlainObject$1(args[1]) && args[2] instanceof NeuNode) {
        return [ context, args[0], args[1], args[2], null ];
      }
      // (sdef, target, action)
      if (args[1] instanceof NeuNode && typeof args[2] === "string") {
        return [ context, args[0], null, args[1], args[2] ];
      }
      break;
    case 4:
      // (sdef, params, target, action)
      if (isPlainObject$1(args[1]) && args[2] instanceof NeuNode && typeof args[3] === "string") {
        return [ context, args[0], args[1], args[2], args[3] ];
      }
      break;
    }
  }
  throw TypeError(`
    Provided parameters for Instrument constructor is invalid.
  `.trim());
}

function toSDef(context, sdef) {
  if (typeof sdef === "string") {
    return context.getSDefByName(sdef);
  }
  if (typeof sdef === "function") {
    return new NeuSDef(context, sdefBuild(sdefName(sdef), sdef));
  }
  if (isSDefJSON(sdef)) {
    return new NeuSDef(context, sdef);
  }
  return sdef;
}

const ADD_ACTION_DICT = Object.assign(Object.create(null), {
  0            : 0,
  "addToHead"  : 0,
  "addHead"    : 0,
  "head"       : 0,
  "h"          : 0,
  1            : 1,
  "addToTail"  : 1,
  "addTail"    : 1,
  "tail"       : 1,
  "t"          : 1,
  2            : 2,
  "addBefore"  : 2,
  "before"     : 2,
  "b"          : 2,
  3            : 3,
  "addAfter"   : 3,
  "after"      : 3,
  "a"          : 3,
  4            : 4,
  "addReplace" : 4,
  "replace"    : 4,
  "r"          : 4,
});

function toAddAction(addAction) {
  return ADD_ACTION_DICT[addAction] || 0;
}

function toNodeId(value) {
  if (typeof value === "number") {
    return value|0;
  }

  if (value && typeof value.nodeId === "number") {
    return value.nodeId|0;
  }

  return 0;
}

class NeuGroup extends NeuNode {
  static create(context, ...args) {
    return new NeuGroup(...bindArgs$3(context, args));
  }

  constructor(context, nodeId, target, action) {
    super(context, nodeId);

    this.isGroup = true;

    const targetId = toNodeId(target);
    const addAction = toAddAction(action);
    const cmd = context.commands.g_new(nodeId, addAction, targetId);

    context.sendOSC(cmd);
  }

  freeAll() {
    const { context } = this;
    const cmd = context.commands.g_freeAll(this.nodeId);

    context.sendOSC(cmd);
    context.unregisterNode(this);

    this._.state = "disposed";

    return this;
  }

  deepFree() {
    const { context } = this;
    const cmd = context.commands.g_deepFree(this.nodeId);

    context.sendOSC(cmd);
    context.unregisterNode(this);

    this._.state = "disposed";

    return this;
  }
}

function bindArgs$3(context, args) {
  switch (args.length) {
  case 0:
    return [ context, context.nextNodeId(), context.rootNode, "addToHead" ];
  case 1:
    // (nodeId)
    if (typeof args[0] === "number") {
      return [ context, args[0], context.rootNode, "addToHead" ];
    }
    // (target)
    if (args[0] instanceof NeuNode) {
      return [ context, context.nextNodeId(), args[0], "addToHead" ];
    }
    break;
  case 2:
    // (nodeId, target)
    if (typeof args[0] === "number" && args[1] instanceof NeuNode) {
      return [ context, args[0], args[1], "addToHead" ];
    }
    // (target, action)
    if (args[0] instanceof NeuNode && typeof args[1] === "string") {
      return [ context, context.nextNodeId(), args[0], args[1] ];
    }
    break;
  case 3:
    // (nodeId, target, action)
    if (typeof args[0] === "number" && args[1] instanceof NeuNode && typeof args[2] === "string") {
      return [ context, args[0], args[1], args[2] ];
    }
    break;
  }
  throw TypeError(`
    Provided parameters for Group constructor is invalid.
  `.trim());
}

class NeuSynth extends NeuNode {
  static create(context, ...args) {
    return new NeuSynth(...bindArgs$4(context, args));
  }

  constructor(context, inst, params, nodeId, target, action) {
    super(context, nodeId);

    if (Array.isArray(params)) {
      params = toParams(params, inst);
    }
    params = Object.assign({}, inst.params, params);

    target = target != null ? target : inst.target != null ? inst.target : context.rootNode;
    action = action != null ? action : inst.action != null ? inst.action : "addToHead";

    this.inst = inst;
    this.isSynth = true;

    const targetId = toNodeId(target);
    const addAction = toAddAction(action);
    const ctls = buildOSCParamsCtl(context, inst, params);
    const inputs = buildOSCParamsIn(context, inst, params);
    const outputs = buildOSCParamsOut(context, inst, params);

    this._.inputs = Array.from({ length: inst.numberOfInputs }, (_, i) => {
      const { rate, length } = inst.inputs(i);
      const index = inputs[i * 2 + 1].value;

      return new NeuBus(context, rate, index, length);
    });
    this._.outputs = Array.from({ length: inst.numberOfOutputs }, (_, i) => {
      const { rate, length } = inst.outputs(i);
      const index = outputs[i * 2 + 1].value;

      return new NeuBus(context, rate, index, length);
    });

    const cmd = prependDRecvIfNeeded(inst.sdef, context.commands.s_new(
      inst.sdefName, this.nodeId, addAction, targetId, ...ctls, ...inputs, ...outputs
    ));

    context.sendOSC(cmd);
  }

  get ctlNames() {
    return this.inst.ctlNames;
  }

  get numberOfInputs() {
    return this._.inputs.length;
  }

  get numberOfOutputs() {
    return this._.outputs.length;
  }

  inputs(n) {
    return this._.inputs[n] || null;
  }

  outputs(n) {
    return this._.outputs[n] || null;
  }
}

function bindArgs$4(context, args) {
  args[0] = toInst(context, args[0]);

  if (args[0] instanceof NeuInstrument) {
    switch (args.length) {
    case 1:
      // (inst)
      return [ context, args[0], {}, context.nextNodeId(), null, null ];
    case 2:
      // (inst, params)
      if (isParams(args[1])) {
        return [ context, args[0], args[1], context.nextNodeId(), null, null ];
      }
      // (inst, nodeId)
      if (typeof args[1] === "number") {
        return [ context, args[0], {}, args[1], null, null ];
      }
      // (inst, target)
      if (args[1] instanceof NeuNode) {
        return [ context, args[0], {}, context.nextNodeId(), args[1], null ];
      }
      break;
    case 3:
      // (inst, params, nodeId)
      if (isParams(args[1]) && typeof args[2] === "number") {
        return [ context, args[0], args[1], args[2], null, null ];
      }
      // (inst, params, target)
      if (isParams(args[1]) && args[2] instanceof NeuNode) {
        return [ context, args[0], args[1], context.nextNodeId(), args[2], null ];
      }
      // (inst, nodeId, target)
      if (typeof args[1] === "number" && args[2] instanceof NeuNode) {
        return [ context, args[0], {}, args[1], args[2], null ];
      }
      // (inst, target, action)
      if (args[1] instanceof NeuNode && typeof args[2] === "string") {
        return [ context, args[0], {}, context.nextNodeId(), args[1], args[2] ];
      }
      break;
    case 4:
      // (inst, params, nodeId, target)
      if (isParams(args[1]) && typeof args[2] === "number" && args[3] instanceof NeuNode) {
        return [ context, args[0], args[1], args[2], args[3], null ];
      }
      // (inst, params, target, action)
      if (isParams(args[1]) && args[2] instanceof NeuNode && typeof args[3] === "string") {
        return [ context, args[0], args[1], context.nextNodeId(), args[2], args[3] ];
      }
      // (inst, nodeId, target, action)
      if (typeof args[1] === "number" && args[2] instanceof NeuNode && typeof args[3] === "string") {
        return [ context, args[0], {}, args[1], args[2], args[3] ];
      }
      break;
    case 5:
      // (inst, params, nodeId, target, action)
      if (isParams(args[1]) && typeof args[2] === "number" && args[3] instanceof NeuNode && typeof args[4] === "string") {
        return [ context, args[0], args[1], args[2], args[3], args[4] ];
      }
      break;
    }
  }
  throw TypeError(`
    Provided parameters for Synth constructor is invalid.
  `.trim());
}

function isParams(value) {
  return isPlainObject$1(value) || Array.isArray(value);
}

function toParams(values, inst) {
  const ctlNames = inst.ctlNames;

  return values.reduce((params, value, index) => {
    return (params[ctlNames[index]] = value, params);
  }, {});
}

function toInst(context, inst) {
  if (typeof inst === "string") {
    inst = context.getSDefByName(inst);
  }
  if (typeof inst === "function") {
    inst = new NeuSDef(context, sdefBuild("@@" + sdefName(inst), inst), { noRegister: true });
  }
  if (isSDefJSON(inst)) {
    inst = Object.assign({}, inst, { name: `@@${ inst.name }` });
    inst = new NeuSDef(context, inst, { noRegister: true });
  }
  if (inst instanceof NeuSDef) {
    inst = new NeuInstrument(context, inst);
  }
  return inst;
}

function buildOSCParamsCtl(context, inst, params) {
  const cmdParams = [];
  const ctlNames = inst.ctlNames;

  ctlNames.filter(name => params.hasOwnProperty(name)).forEach((name) => {
    const { index, length } = inst.ctls(name);

    if (params[name] instanceof NeuBus) {
      const bus = params[name];

      if (bus.rate === AUDIO) {
        cmdParams.push(index, "a" + bus.index);
      } else {
        cmdParams.push(index, "c" + bus.index);
      }
    } else {
      const values = toArray$1(params[name]);

      if (values.length !== length) {
        throw new TypeError(`
          ctl['${ name }'] require ${ length } items, but got ${ values.length } items.
        `.trim());
      }

      if (values.length === 1) {
        cmdParams.push(index, values[0]);
      } else {
        cmdParams.push(index, values);
      }
    }
  });

  return cmdParams;
}

function buildOSCParamsIn(context, inst, params) {
  const cmdParams = [];
  const numberOfInputs = inst.numberOfInputs;
  const inputs = toArray$1(params["$in"]);
  const inSynth = inputs.length === 1 && inputs[0] instanceof NeuSynth;

  Array.from({ length: numberOfInputs }, (_, i) => {
    const { rate, index, length } = inst.inputs(i);
    const in_ = inSynth ? inputs[0].outputs(i) : inputs[i];

    let busIndex;

    if (in_ == null) {
      busIndex = context.allocBus(rate, length).index;
    } else if (in_ instanceof NeuBus) {
      busIndex = getBus(in_, "input", i, rate, length);
    } else {
      busIndex = toBus(in_);
    }

    cmdParams.push(index, { type: "integer", value: busIndex });
  });

  return cmdParams;
}

function buildOSCParamsOut(context, inst, params) {
  const cmdParams = [];
  const numberOfOutputs = inst.numberOfOutputs;
  const outputs = toArray$1(params["$out"]);
  const inSynth = outputs.length === 1 && outputs[0] instanceof NeuSynth;

  let nextOutAR = 0;
  let nextOutKR = 0;

  Array.from({ length: numberOfOutputs }, (_, i) => {
    const { rate, index, length } = inst.outputs(i);
    const out = inSynth ? outputs[0].inputs(i) : outputs[i];

    let busIndex;

    if (out == null) {
      busIndex = rate === AUDIO ? nextOutAR : nextOutKR;
    } else if (out instanceof NeuBus) {
      busIndex = getBus(out, "output", i, rate, length);
    } else {
      busIndex = toBus(out);
    }

    cmdParams.push(index, { type: "integer", value: busIndex });

    if (rate === AUDIO) {
      nextOutAR = busIndex + length;
    } else {
      nextOutKR = busIndex + length;
    }
  });

  return cmdParams;
}

/* istanbul ignore next */
function toArray$1(value) {
  return value == null ? [] : Array.isArray(value) ? value : [ value ];
}

/* istanbul ignore next */
function getBus(value, type, index, rate, length) {
  if (value.rate !== rate) {
    throw new TypeError(`
      ${ type }s[${ index }] require ${ toStrRate$1(rate) } rate, but got ${ toStrRate$1(value.rate) } rate.
    `.trim());
  }
  if (value.length !== length) {
    throw new TypeError(`
      ${ type }s[${ index }] require ${ length } channels, but got ${ value.length } channels.
    `.trim());
  }
  return value.index;
}

/* istanbul ignore next */
function toBus(value) {
  if (typeof value === "number") {
    return value|0;
  }
  return 0;
}

/* istanbul ignore next */
function toStrRate$1(value) {
  return [ "scalar", "control", "audio", "demand" ][value] || "unknown";
}

var global$1 = typeof global !== "undefined" ? global :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {};

function defaults$1(value, defaultValue) {
  return typeof value !== "undefined" ? value : defaultValue;
}

class NeuTimeline extends NeuObject {
  constructor(context, opts = {}) {
    super(context);

    this.playbackTime = 0;
    this.interval = defaults$1(opts.interval, 0.025);
    this.aheadTime = defaults$1(opts.aheadTime, 0.1);
    this.timerAPI = defaults$1(opts.timerAPI, global$1);
    this.dateAPI = defaults$1(opts.dateAPI, Date);

    this._.timerId = 0;
    this._.schedId = 0;
    this._.scheds = [];
  }

  get state() {
    return this._.timerId !== 0 ? "running" : "suspended";
  }

  get events() {
    return this._.scheds;
  }

  start() {
    if (this._.timerId === 0) {
      this.playbackTime = this.dateAPI.now() / 1000;
      this._.timerId = this.timerAPI.setInterval(
        this.process.bind(this), this.interval * 1000
      );
    }
    return this;
  }

  stop() {
    if (this._.timerId !== 0) {
      this.timerAPI.clearInterval(this._.timerId);
      this._.timerId = 0;
    }
    return this;
  }

  sched(time, callback, ...args) {
    const id = ++this._.schedId;
    const event = { id, time, callback, args };
    const scheds = this._.scheds;

    if (scheds.length === 0 || scheds[scheds.length - 1].time <= time) {
      scheds.push(event);
    } else {
      for (let i = 0, imax = scheds.length; i < imax; i++) {
        if (time < scheds[i].time) {
          scheds.splice(i, 0, event);
          break;
        }
      }
    }

    return id;
  }

  unsched(schedId) {
    const scheds = this._.scheds;

    for (let i = 0, imax = scheds.length; i < imax; i++) {
      if (schedId === scheds[i].id) {
        scheds.splice(i, 1);
        break;
      }
    }

    return schedId;
  }

  unschedAll() {
    this._.scheds.splice(0);
  }

  process() {
    const scheds = this._.scheds;
    const t0 = this.dateAPI.now() / 1000;
    const t1 = t0 + this.aheadTime;

    this.playbackTime = t0;
    this.context.beginSched();

    while (scheds.length && scheds[0].time < t1) {
      const event = scheds.shift();

      this.playbackTime = event.time;

      event.callback(...event.args);
    }

    this.context.endSched();
    this.playbackTime = t1;
  }
}

class NeuSched extends NeuObject {
  constructor(context) {
    super(context);

    this._.process = this.process.bind(this);
  }

  get state() {
    return this._.state;
  }

  /* istanbul ignore next */
  start() {}

  /* istanbul ignore next */
  stop() {}

  /* istanbul ignore next */
  resume() {}

  /* istanbul ignore next */
  suspend() {}

  /* istanbul ignore next */
  at() {}

  /* istanbul ignore next */
  process() {}
}

class NeuSchedSrc extends NeuSched {
  constructor(context) {
    super(context);

    this._.state = "suspended";
    this._.schedId = 0;
  }

  start(startTime) {
    if (this._.schedId === 0) {
      this._.state = "running";

      if (typeof startTime !== "number") {
        // TODO: 250msec ???
        startTime = Date.now() / 1000 + 0.25;
      }

      this._.schedId = this._.process(startTime);
    }
    return this;
  }

  stop() {
    if (this._.schedId !== 0) {
      this.context.unsched(this._.schedId);
      this._.state = "suspended";
      this._.stateId = 0;
    }
    return this;
  }

  resume() {
    /* istanbul ignore next */
    if (this._.state === "suspended") {
      this._.state = "running";
    }
  }

  suspend() {
    /* istanbul ignore next */
    if (this._.state === "running") {
      this._.state = "suspended";
    }
  }
}

class NeuMetro extends NeuSchedSrc {
  static create(context, ...args) {
    return new NeuMetro(...bindArgs$5(context, args));
  }

  constructor(context, interval) {
    super(context);

    this._.currentInterval = interval;
    this._.nextInterval = interval;
    this._.currentTime = 0;
    this._.nextTime = this.at(1);
    this._.counter = 0;
  }

  get value() {
    return this._.nextInterval;
  }

  set value(newValue) {
    this._.nextInterval = newValue;
  }

  at(pos) {
    pos = Math.max(0, Math.min(pos, 1));

    return this._.currentTime + (this._.currentInterval) * pos;
  }

  process(time) {
    const { context } = this;

    this._.currentTime = time;

    if (this._.state === "running") {
      this.emit("sync", { count: this._.counter++ });
    }

    this._.currentInterval = this._.nextInterval;
    this._.nextTime = this.at(1);

    if (this._.state === "running") {
      this.emit("@@sync");
    }

    return context.sched(this._.nextTime, this._.process, this._.nextTime);
  }
}

function bindArgs$5(context, args) {
  return [ context, ...args ];
}

class NeuCPS extends NeuMetro {
  static create(context, ...args) {
    return new NeuCPS(...bindArgs$6(context, args));
  }

  constructor(context, cps) {
    super(context, 1 / cps);
  }

  get value() {
    return 1 / super.value;
  }

  set value(newValue) {
    super.value = 1 / newValue;
  }
}

function bindArgs$6(context, args) {
  return [ context, ...args ];
}

class NeuSchedProc extends NeuSched {
  constructor(context, src) {
    super(context);

    this._.src = src;
    this._.state = "running";
    this._.src.addListener("@@sync", this._.process);
  }

  start(startTime) {
    this._.src.start(startTime);
    return this;
  }

  stop(stopTime) {
    this._.src.stop(stopTime);
    return this;
  }

  suspend() {
    if (this._.state === "running") {
      this._.state = "suspended";
      this._.src.removeListener("@@sync", this._.process);
    }
    return this;
  }

  resume() {
    if (this._.state === "suspended") {
      this._.state = "running";
      this._.src.addListener("@@sync", this._.process);
    }
    return this;
  }

  at(pos) {
    return this._.src.at(pos);
  }
}

class NeuCyclic extends NeuSchedProc {
  static create(context, ...args) {
    return new NeuCyclic(...bindArgs$7(context, args));
  }

  constructor(context, src, pattern) {
    super(context, src);

    this._.params = {};
    this._.counter = 0;
    this._.pattern = [];
    this._.iter = null;

    if (pattern) {
      this.pattern = pattern;
    }
  }

  get pattern() {
    return this._.pattern;
  }

  set pattern(value) {
    this._.pattern = value;
    this._.iter = isGenFunc(value) ? pseq([ value ], Infinity)() : null;
  }

  apply(params) {
    Object.keys(params).forEach((key) => {
      if (params[key] == null) {
        delete this._.params[key];
      } else {
        this._.params[key] = toParams$1(params[key]);
      }
    });
    return this;
  }

  process() {
    const { context } = this;

    this.emit("sync", { count: this._.counter++ });
    this.emit("@@sync");

    const pattern = this._.iter ? this._.iter.next().value : this._.pattern;

    compilePattern(pattern, 0, 1, []).forEach(({ pos, payload }, index) => {
      context.sched(this._.src.at(pos), () => {
        const params = Object.keys(this._.params).reduce((obj, key) => {
          return (obj[key] = getValue(this._.params[key], index), obj);
        }, { $value: payload });

        this.emit("data", params);
      });
    });
  }
}

function bindArgs$7(context, args) {
  return [ context, ...args ];
}

function compilePattern(pattern, pos, unit, list) {
  unit = unit / pattern.length;
  pattern.forEach((value, index) => {
    if (value != null) {
      if (Array.isArray(value)) {
        compilePattern(value, pos + unit * index, unit, list);
      } else {
        list.push({ pos: pos + unit * index, payload: value });
      }
    }
  });
  return list;
}

function getValue(value, index) {
  if (Array.isArray(value)) {
    return value[index % value.length];
  }
  if (value && typeof value.next === "function") {
    return value.next().value;
  }
  return value;
}

function toParams$1(value) {
  if (isGenFunc(value)) {
    return pseq([ value ], Infinity)();
  }
  return value;
}

class NeuContext extends NeuObject {
  constructor(opts) {
    super(null);

    this.context = this;
    this.server = new opts.ServerClass(opts);
    this.server.on("recvOSC", (msg) => {
      /* istanbul ignore else */
      if (typeof this[msg.address] == "function") {
        this[msg.address](msg);
      }
      this.apiEmit("recvOSC", msg);
    });
    this.commands = this.server.commands;
    this.sampleRate = defaults$1(opts.sampleRate, 44100);
    this.rootNode = { nodeId: 1000 };

    this._.timeline = new NeuTimeline(this);
    this._.nextNodeId = this.rootNode.nodeId + 1;
    this._.nextBufId = 128;
    this._.sendOSCAt = false;
    this._.aBusAlloc = new NeuBusAllocator(this, AUDIO  ,  1024, 128);
    this._.cBusAlloc = new NeuBusAllocator(this, CONTROL, 16384, 128);
    this._.sdefMap = new Map();
    this._.nodeMap = new Map();

    this.sendOSC({
      timetag: [ 0, 1 ],
      elements: [
        this.commands.notify(1),
        this.commands.dumpOSC(1),
        this.commands.clearSched(),
        this.commands.g_new(this.rootNode.nodeId),
        this.commands.g_freeAll(this.rootNode.nodeId),
      ]
    });
  }

  createAPI() {
    return [
      "now",
      "sched", "schedRel", "unsched", "unschedAll",
      "abus", "cbus", "reset",
      "buffer", "sdef", "inst",
      "group", "synth",
      "metro", "cps", "cyclic",
    ].reduce((api, name) => {
      return (api[name] = this[name].bind(this), api);
    }, {});
  }

  now() {
    return this._.timeline.playbackTime;
  }

  sched(time, callback, ...args) {
    return this._.timeline.sched(time, callback, ...args);
  }

  schedRel(delta, callback, ...args) {
    return this._.timeline.sched(this.now() + delta, callback, ...args);
  }

  unsched(schedId) {
    return this._.timeline.unsched(schedId);
  }

  unschedAll(callback) {
    this._.timeline.unschedAll();
    this.sendOSC(this.commands.clearSched(), callback);
  }

  abus(length) {
    return this.allocBus(AUDIO, length);
  }

  cbus(length) {
    return this.allocBus(CONTROL, length);
  }

  reset(callback) {
    this._.timeline.unschedAll();
    this.sendOSC({
      timetag: [ 0, 1 ],
      elements: [
        this.commands.clearSched(),
        this.commands.g_freeAll(this.rootNode.nodeId),
      ]
    }, callback);
  }

  buffer(...args) {
    return NeuBuffer.create(this, ...args);
  }

  sdef(...args) {
    return NeuSDef.create(this, ...args);
  }

  inst(...args) {
    return NeuInstrument.create(this, ...args);
  }

  group(...args) {
    return NeuGroup.create(this, ...args);
  }

  synth(...args) {
    return NeuSynth.create(this, ...args);
  }

  metro(...args) {
    return NeuMetro.create(this, ...args);
  }

  cps(...args) {
    return NeuCPS.create(this, ...args);
  }

  cyclic(...args) {
    return NeuCyclic.create(this, ...args);
  }

  // internal api

  nextNodeId() {
    return this._.nextNodeId++;
  }

  nextBufId() {
    return this._.nextBufId++;
  }

  allocBuffer(bufId, numberOfChannels, length, callback) {
    this.server.allocBuffer(bufId, numberOfChannels, length, callback);
  }

  loadBuffer(bufId, source, callback) {
    this.server.loadBuffer(bufId, source, callback);
  }

  allocBus(rate, length) {
    if (rate === AUDIO) {
      return this._.aBusAlloc.alloc(length);
    }
    return this._.cBusAlloc.alloc(length);
  }

  freeBus(bus) {
    if (bus.rate === AUDIO) {
      return this._.aBusAlloc.free(bus);
    }
    return this._.cBusAlloc.free(bus);
  }

  sendOSC(...args) {
    if (this._.sendOSCAt) {
      this.sendOSCAt(this.now(), ...args);
    } else {
      this.server.sendOSC(...args);
    }
  }

  sendOSCAt(when, ...args) {
    this.server.sendOSCAt(when, ...args);
  }

  beginSched() {
    this._.sendOSCAt = true;
  }

  endSched() {
    this._.sendOSCAt = false;
  }

  registerSDef(sdef) {
    this._.sdefMap.set(sdef.name, sdef);
  }

  unregisterSDef(sdef) {
    this._.sdefMap.delete(sdef.name);
  }

  getSDefByName(name) {
    return this._.sdefMap.get(name) || null;
  }

  registerNode(node) {
    this._.nodeMap.set(node.nodeId, node);
  }

  unregisterNode(node) {
    this._.nodeMap.delete(node.nodeId);
  }

  getNodeByNodeId(nodeId) {
    return this._.nodeMap.get(nodeId) || null;
  }

  apiEmit(event, payload) {
    this.emit("api-emit", { event, payload });
  }

  n_cmd(msg) {
    const node = this.getNodeByNodeId(msg.args[0]);

    /* istanbul ignore else */
    if (node && typeof node[msg.address] === "function") {
      node[msg.address](msg);
    }
  }

  ["/n_go"](msg) {
    this.n_cmd(msg);
  }

  ["/n_end"](msg) {
    this.n_cmd(msg);
  }

  ["/n_off"](msg) {
    this.n_cmd(msg);
  }

  ["/n_on"](msg) {
    this.n_cmd(msg);
  }

  ["/n_move"](msg) {
    this.n_cmd(msg);
  }

  ["/n_info"](msg) {
    this.n_cmd(msg);
  }
}

const defaultOpts = {};

var $ = function(selectServerClass) {
  function neume(opts) {
    const context = createContext(opts, selectServerClass);
    const api = createAPI(context);

    context.on("api-emit", ({ event, payload }) => {
      api.emit(event, payload);
    });

    // FIXME: access to a private member..
    context._.timeline.start();

    return api;
  }

  return neume;
};

function createContext(opts, selectServerClass) {
  opts = Object.assign({}, defaultOpts, opts);

  if (opts.ServerClass == null) {
    opts.ServerClass = selectServerClass(opts);
  }

  return new NeuContext(opts);
}

function createAPI(context) {
  return Object.assign(new NeuObject(null),
    constants$1, context.createAPI(), musicAPI, patternAPI, { scapi }
  );
}

function isOSCBundle(value) {
  return !!(value && Array.isArray(value.elements));
}

function toOSCBundle(bundle, value) {
  if (isOSCBundle(bundle)) {
    return Object.assign({}, bundle, {
      elements: bundle.elements.concat(value)
    });
  }
  return {
    timetag: [ 0, 1 ],
    elements: [ bundle, value ]
  };
}

function toOSCTimeTag(value) {
  const time = value + 2208988800;
  const hi = time >>> 0;
  const lo = ((time - hi) * 4294967296) >>> 0;

  return [ hi, lo ];
}

function toOSCSchedBundle(when, msg) {
  if (isOSCBundle(msg)) {
    return Object.assign({}, msg, {
      timetag: toOSCTimeTag(when),
    });
  }
  return {
    timetag: toOSCTimeTag(when),
    elements: [ msg ]
  };
}

class AbstractServer extends EventEmitter {
  constructor(commands) {
    super();

    this.commands = commands;
    this._syncId = 0;
    this._syncFn = new Map();
    this._bqueryFn = new Map();
  }

  allocBuffer(bufId, numberOfChannels, length, callback) {
    this._bqueryFn.set(bufId, callback);

    const next = this.commands.b_query(bufId);
    const cmd = this.commands.b_alloc(bufId, length, numberOfChannels, next);

    this.sendOSC(cmd);
  }

  loadBuffer(bufId, source, callback) {
    this._bqueryFn.set(bufId, callback);
    this._loadBuffer(bufId, source);
  }

  sendOSC(msg, callback) {
    if (typeof callback === "function") {
      msg = this._toSyncOSCMessage(msg, callback);
    }
    this._sendOSC(msg);
  }

  sendOSCAt(when, msg, callback) {
    this.sendOSC(toOSCSchedBundle(when, msg), callback);
  }

  recvOSC(msg) {
    if (isOSCBundle(msg)) {
      return msg.forEach((msg) => {
        this.recvOSC(msg);
      });
    }
    msg.args = msg.args.map(({ value }) => value);
    if (typeof this[msg.address] === "function") {
      this[msg.address](msg);
    }
    this.emit("recvOSC", msg);
  }

  _sendOSC() {
    throw new Error(`
      SubclassResponsibility: _sendOSC() should have been implemented by ${ this.constructor.name }.
    `.trim());
  }

  _toSyncOSCMessage(msg, callback) {
    const syncId = this._syncId++;

    this._syncFn.set(syncId, callback);

    return toOSCBundle(msg, this.commands.sync(syncId));
  }

  ["/synced"]({ args }) {
    const syncId = args[0];

    if (this._syncFn.has(syncId)) {
      this._syncFn.get(syncId)();
      this._syncFn.delete(syncId);
    }
  }

  ["/b_info"]({ args }) {
    const items = args.length / 4;

    for (let i = 0; i < items; i++) {
      const bufId = args[i * 4 + 0];
      const length = args[i * 4 + 1];
      const numberOfChannels = args[i * 4 + 2];
      const sampleRate = args[i * 4 + 3];

      if (this._bqueryFn.has(bufId)) {
        this._bqueryFn.get(bufId)({
          bufId, length, numberOfChannels, sampleRate
        });
        this._bqueryFn.delete(bufId);
      }
    }
  }
}

function $i(value) {
  return { type: "integer", value: value|0 };
}

function $f(value) {
  return { type: "float", value: +value };
}

function $s(value) {
  return { type: "string", value: "" + value };
}

function $b(value) {
  return { type: "blob", value };
}

function $map(values, types) {
  return values.map((value, index) => {
    return types[index % types.length](value);
  });
}

// Master Controls
function notify(code) {
  return {
    address: "/notify",
    args: [ $i(code) ]
  };
}

function status() {
  return {
    address: "/status"
  };
}

function dumpOSC(code) {
  return {
    address: "/dumpOSC",
    args: [ $i(code) ]
  };
}

function sync(syncId) {
  return {
    address: "/sync",
    args: [ $i(syncId) ]
  };
}

function clearSched() {
  return {
    address: "/clearSched"
  };
}

// Synth Definition Commands
function d_recv(sdef, next) {
  return {
    address: "/d_recv",
    args: [ $b(sdef) ].concat(
      next != null ? $b(next) : []
    )
  };
}

function d_free(name, ...args) {
  return {
    address: "/d_free",
    args: [ $s(name) ].concat(
      $map(args, [ $s ])
    )
  };
}

// Node Commands
function n_free(nodeId, ...args) {
  return {
    address: "/n_free",
    args: [ $i(nodeId) ].concat(
      $map(args, [ $i ])
    )
  };
}

function n_run(nodeId, runFlag, ...args) {
  return {
    address: "/n_run",
    args: [ $i(nodeId), $i(runFlag) ].concat(
      $map(args, [ $i, $i ])
    )
  };
}

function n_set(nodeId, ...args) {
  return {
    address: "/n_set",
    args: [ $i(nodeId) ].concat(args.map((value, index) => {
      if (index % 2 === 0) {
        return typeof value === "string" ? $s(value) : $i(value);
      }
      if (Array.isArray(value) && value.length !== 1) {
        return value.map($f);
      }
      return $f(+value);
    }))
  };
}

function n_map(nodeId, ...args) {
  return {
    address: "/n_map",
    args: [ $i(nodeId) ].concat(args.map((value, index) => {
      if (index % 2 === 0) {
        return typeof value === "string" ? $s(value) : $i(value);
      }
      return $i(value);
    }))
  };
}

function n_mapa(nodeId, ...args) {
  return {
    address: "/n_mapa",
    args: [ $i(nodeId) ].concat(args.map((value, index) => {
      if (index % 2 === 0) {
        return typeof value === "string" ? $s(value) : $i(value);
      }
      return $i(value);
    }))
  };
}

function n_before(nodeId, targetId, ...args) {
  return {
    address: "/n_before",
    args: [ $i(nodeId), $i(targetId) ].concat(
      $map(args, [ $i, $i ])
    )
  };
}

function n_after(nodeId, targetId, ...args) {
  return {
    address: "/n_after",
    args: [ $i(nodeId), $i(targetId) ].concat(
      $map(args, [ $i, $i ])
    )
  };
}

// Synth Commands
function s_new(name, nodeId, addAction, targetId, ...args) {
  return {
    address: "/s_new",
    args: [ $s(name), $i(nodeId), $i(addAction), $i(targetId) ].concat(
      args.map((value, index) => {
        if (index % 2 === 0) {
          return typeof value === "string" ? $s(value) : $i(value);
        }
        if (Array.isArray(value) && value.length !== 1) {
          return value.map($f);
        }
        if (value && typeof value.type === "string") {
          return value;
        }
        return typeof value === "string" ? $s(value) : $f(+value);
      })
    )
  };
}

function s_get(nodeId, ...args) {
  return {
    address: "/s_get",
    args: [ $i(nodeId) ].concat(
      args.map((value) => {
        return typeof value === "string" ? $s(value) : $i(value);
      })
    )
  };
}

// Group Commands
function g_new(nodeId, addAction, targetId, ...args) {
  return {
    address: "/g_new",
    args: [ $i(nodeId), $i(addAction), $i(targetId) ].concat(
      $map(args, [ $i, $i, $i ])
    )
  };
}

function g_head(nodeId, targetId, ...args) {
  return {
    address: "/g_head",
    args: [ $i(nodeId), $i(targetId) ].concat(
      $map(args, [ $i, $i ])
    )
  };
}

function g_tail(nodeId, targetId, ...args) {
  return {
    address: "/g_tail",
    args: [ $i(nodeId), $i(targetId) ].concat(
      $map(args, [ $i, $i ])
    )
  };
}

function g_freeAll(groupId, ...args) {
  return {
    address: "/g_freeAll",
    args: [ $i(groupId) ].concat(
      $map(args, [ $i ])
    )
  };
}

function g_deepFree(groupId, ...args) {
  return {
    address: "/g_deepFree",
    args: [ $i(groupId) ].concat(
      $map(args, [ $i ])
    )
  };
}

// Buffer Commands
function b_alloc(bufId, length, numberOfChannels, next) {
  return {
    address: "/b_alloc",
    args: [ $i(bufId), $i(length), $i(numberOfChannels) ].concat(
      next != null ? $b(next) : []
    )
  };
}

function b_allocRead(bufId, source, offset, length, next) {
  return {
    address: "/b_allocRead",
    args: [ $i(bufId), $s(source), $i(offset), $i(length) ].concat(
      next != null ? $b(next) : []
    )
  };
}

function b_free(bufId, next) {
  return {
    address: "/b_free",
    args: [ $i(bufId) ].concat(
      next != null ? $b(next) : []
    )
  };
}

function b_zero(bufId, next) {
  return {
    address: "/b_zero",
    args: [ $i(bufId) ].concat(
      next != null ? $b(next) : []
    )
  };
}

function b_query(bufId, ...args) {
  return {
    address: "/b_query",
    args: [ $i(bufId) ].concat(
     $map(args, [ $i ])
    )
  };
}

// Control Bus Commands
function c_set(index, value, ...args) {
  return {
    address: "/c_set",
    args: [ $i(index), $f(value) ].concat(
      $map(args, [ $i, $f ])
    )
  };
}

function c_get(index, ...args) {
  return {
    address: "/c_get",
    args: [ $i(index) ].concat(
      $map(args, [ $i ])
    )
  };
}


var commands = Object.freeze({
	notify: notify,
	status: status,
	dumpOSC: dumpOSC,
	sync: sync,
	clearSched: clearSched,
	d_recv: d_recv,
	d_free: d_free,
	n_free: n_free,
	n_run: n_run,
	n_set: n_set,
	n_map: n_map,
	n_mapa: n_mapa,
	n_before: n_before,
	n_after: n_after,
	s_new: s_new,
	s_get: s_get,
	g_new: g_new,
	g_head: g_head,
	g_tail: g_tail,
	g_freeAll: g_freeAll,
	g_deepFree: g_deepFree,
	b_alloc: b_alloc,
	b_allocRead: b_allocRead,
	b_free: b_free,
	b_zero: b_zero,
	b_query: b_query,
	c_set: c_set,
	c_get: c_get
});

/* eslint-env browser */

class SCSynthWorker extends AbstractServer {
  constructor(opts) {
    super(commands, opts);

    this._worker = new Worker(opts.workerPath);
    this._worker.onmessage = ({ data }) => {
      switch (data.type) {
      case "osc":
        return this.recvOSC(data.payload);
      }
    };
  }

  _sendOSC(msg) {
    this._worker.postMessage({ type: "osc", payload: msg });
  }
}

var indexBrowser = $((/* opts */) => {
  return SCSynthWorker;
});

exports['default'] = indexBrowser;

Object.defineProperty(exports, '__esModule', { value: true });

})));
