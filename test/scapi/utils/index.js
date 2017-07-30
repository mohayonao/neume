import assert from "assert";
import path from "path";
import glob from "glob";
import * as index from "../../../src/scapi/utils";

describe("scapi/utils", () => {
  it("should have index of all api", () => {
    const files = glob.sync(path.join(__dirname, "../../../src/scapi/utils/*.js"))
      .filter(filepath => path.basename(filepath) !== "index.js" && !path.basename(filepath).startsWith("_"));

    files.forEach((filepath) => {
      const moduleName = path.basename(filepath, ".js");

      assert(typeof index[moduleName] === "function", `'${ moduleName }': missing in index.js`);
    });
  });
});
