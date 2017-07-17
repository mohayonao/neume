import pchunk from "./pchunk";
import pcombine from "./pcombine";
import pconcat from "./pconcat";
import pdrop from "./pdrop";
import pfilter from "./pfilter";
import place from "./place";
import plength from "./plength";
import ploop from "./ploop";
import pmap from "./pmap";
import preject from "./preject";
import pscan from "./pscan";
import pstutter from "./pstutter";
import psub from "./psub";
import ptake from "./ptake";
import puntil from "./puntil";
import pwhile from "./pwhile";
import pzip from "./pzip";

export default function defineChainMethods(p) {
  defineChainMethod(p, "chunk"  , pchunk);
  defineChainMethod(p, "combine", pcombine);
  defineChainMethod(p, "concat" , pconcat);
  defineChainMethod(p, "drop"   , pdrop);
  defineChainMethod(p, "filter" , pfilter);
  defineChainMethod(p, "lace"   , place);
  defineChainMethod(p, "length" , plength);
  defineChainMethod(p, "loop"   , ploop);
  defineChainMethod(p, "map"    , pmap);
  defineChainMethod(p, "reject" , preject);
  defineChainMethod(p, "scan"   , pscan);
  defineChainMethod(p, "stutter", pstutter);
  defineChainMethod(p, "sub"    , psub);
  defineChainMethod(p, "take"   , ptake);
  defineChainMethod(p, "until"  , puntil);
  defineChainMethod(p, "while"  , pwhile);
  defineChainMethod(p, "zip"    , pzip);
  return p;
}

function defineChainMethod(p, name, fn) {
  Object.defineProperty(p, name, {
    value: (...args) => fn(p, ...args),
    enumerable: false, writable: true, configurable: true
  });
}
