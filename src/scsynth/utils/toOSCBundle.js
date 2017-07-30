import isOSCBundle from "./isOSCBundle";

export default function toOSCBundle(bundle, value) {
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
