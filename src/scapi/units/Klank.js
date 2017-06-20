import defineUGen from "./_defineUGen";
import createNode from "../utils/createNode";
import toArray from "../utils/toArray";
import wrapAt from "../utils/wrapAt";

export default defineUGen("Klank", [
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

export function createKlank(type, rate, props) {
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
