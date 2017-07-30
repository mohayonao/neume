import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import nodeBuiltins from "rollup-plugin-node-builtins";
import nodeGlobals from "rollup-plugin-node-globals";
import babili from "rollup-plugin-babili";

const config = {
  format: "umd",
  moduleName: "neume",
  exports: "named",
  plugins: [
    commonjs({ include: "node_modules/**" }),
    nodeResolve(),
    nodeBuiltins(),
    nodeGlobals(),
  ]
};

if (process.env.NODE_ENV === "production") {
  config.plugins.push(
    babili({
      comments: false
    })
  );
}

export default config;
