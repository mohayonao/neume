import defineUGen from "./_defineUGen";

export default defineUGen("PlayBuf", [
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
