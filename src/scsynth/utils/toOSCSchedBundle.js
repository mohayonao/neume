import isOSCBundle from "./isOSCBundle";
import toOSCTimeTag from "./toOSCTimeTag";

export default function toOSCSchedBundle(when, msg) {
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
