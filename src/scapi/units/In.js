import defineUGen from "./_defineUGen";

export default defineUGen("In", [
  [ "bus"        , 0 ],
  [ "numChannels", 1 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "audio",
  multiOut: args => args.pop(),
});
