import defineUGen from "./_defineUGen";

export default defineUGen("Phasor", [
  [ "trig" , 0 ],
  [ "rate" , 1 ],
  [ "start", 0 ],
  [ "end"  , 1 ],
  [ "reset", 0 ],
], {
  rates: { ar: "audio", kr: "control" },
  defaultRate: "audio",
});
