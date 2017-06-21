import * as SpecialIndex from "./_SpecialIndex";

export default function build(name, nodes, ctls) {
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

    const [ type, specialIndex ] = SpecialIndex.fromType(node.type);
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
