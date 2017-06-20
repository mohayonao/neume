import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import nodeBuiltins from "rollup-plugin-node-builtins";
import nodeGlobals from "rollup-plugin-node-globals";
import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";

const config = {
  format: "umd",
  moduleName: "neume",
  exports: "named",
  plugins: [
    commonjs({ include: "node_modules/**" }),
    nodeResolve(),
    nodeBuiltins(),
    nodeGlobals(),
    babel({ exclude: "node_modules/**", plugins: [ "external-helpers" ] }),
  ],
};

if (process.env.NODE_ENV === "production") {
  config.plugins.push(
    uglify()
  );
}

export default config;
