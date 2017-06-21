const SpecialIndexDict = Object.create(null);

`
neg not isNil notNil bitNot abs asFloat asInt ceil floor frac sign squared cubed sqrt exp reciprocal
midicps cpsmidi midiratio ratiomidi dbamp ampdb octcps cpsoct log log2 log10 sin cos tan asin acos
atan sinh cosh tanh rand rand2 linrand bilinrand sum3rand distort softclip coin digitvalue silence
thru rectWindow hanWindow welWindow triWindow ramp scurve
`.trim().split(/\s+/).map((name, index) => {
  SpecialIndexDict[name] = [ "UnaryOpUGen", index ];
});

`
+ - * // / % == != < > <= >= min max & | ^ lcm gcd round roundUp trunc atan2 hypot
hypotApx pow << >> >>> fill ring1 ring2 ring3 ring4 difsqr sumsqr
sqrsum sqrdif absdif thresh amclip scaleneg clip2 excess fold2 wrap2 firstArg rrand exprand
`.trim().split(/\s+/).map((name, index) => {
  SpecialIndexDict[name] = [ "BinaryOpUGen", index ];
});

export function fromType(type) {
  if (SpecialIndexDict[type]) {
    return SpecialIndexDict[type];
  }
  return [ type, 0 ];
}
