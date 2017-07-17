export default function parseFnArgs(fn) {
  const reComments = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;
  const fnStr = fn.toString().replace(reComments, "");
  const matched = fnStr.match(/^(?:async\s+)?([a-zA-Z_$][\w$]*)\s*=>?/);

  if (matched !== null) {
    return [ matched[1] ];
  }

  const args = [];
  let depth = 0;
  let token = "";
  let pos = fnStr.indexOf("(") + 1;

  function collectString(qt) {
    let token = "";

    while (pos < fnStr.length) {
      const ch = fnStr.charAt(pos++);

      token += ch;

      if (ch === "\\") {
        token += fnStr.charAt(pos++);
      } else if (ch === qt) {
        break;
      }
    }

    return token;
  }

  while (pos < fnStr.length) {
    const ch = fnStr.charAt(pos++);

    if (depth === 0) {
      if (ch === ")") {
        break;
      }
      if (ch === ",") {
        args.push(token.trim());
        token = "";
        continue;
      }
    }

    token += ch;

    switch (ch) {
    case "[": case "{": case "(":
      depth += 1;
      break;
    case "]": case "}": case ")":
      depth -= 1;
      break;
    case "'": case '"': case "`":
      token += collectString(ch);
      break;
    }
  }

  token = token.trim();

  if (token) {
    args.push(token);
  }

  return args;
}
