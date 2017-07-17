import zip from "./_zip";
import defineChainMethods from "./_defineChainMethods";

export default function(...args) {
  return defineChainMethods(zip(...args));
}
