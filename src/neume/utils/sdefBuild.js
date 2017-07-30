import scapi from "../../scapi";
import scdef from "../../scdef";
import parseFnArgs from "./parseFnArgs";

const { ctl, In, Out } = scapi;

export default function sdefBuild(name, func, fnArgs) {
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

export function createCtl(name, rate, value) {
  switch (rate) {
  case "ar":
    return ctl.ar(name, value);
  case "ir":
    return ctl.ir(name, value);
  case "tr":
    return ctl.tr(name, value);
  default:
    return ctl.kr(name, value);
  }
}

export function createInAPI({ inputs }) {
  function $(fn, numberOfChannels = 1) {
    const bus = ctl.ir("in");
    const in_ = fn(bus, numberOfChannels);

    bus.type += `:${ inputs.length }`;
    inputs.push(in_);

    return in_;
  }

  const $in = numberOfChannels => $(In.ar, numberOfChannels);

  $in.ar = numberOfChannels => $(In.ar, numberOfChannels);
  $in.kr = numberOfChannels => $(In.kr, numberOfChannels);

  return $in;
}

export function createOutAPI({ outputs }) {
  function $(fn, node) {
    const bus = ctl.ir("out");
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
