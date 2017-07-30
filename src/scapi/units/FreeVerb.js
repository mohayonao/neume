import defineFilterUGen from "./_defineFilterUGen";

export default defineFilterUGen("FreeVerb", [
  [ "mix" , 0.33 ],
  [ "room", 0.5  ],
  [ "dump", 0.5  ],
]);
