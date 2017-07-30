export default function toOSCTimeTag(value) {
  const time = value + 2208988800;
  const hi = time >>> 0;
  const lo = ((time - hi) * 4294967296) >>> 0;

  return [ hi, lo ];
}
