import * as babel from "babel-core";
import isElectron from "is-electron";
import stage_0 from "babel-preset-stage-0";
import transform_es2015_classes from "babel-plugin-transform-es2015-classes";
import transform_es2015_block_scoping from "babel-plugin-transform-es2015-block-scoping";
import transform_neume_override_binary_expression from "../../../babel-plugins/babel-plugin-transform-neume-override-binary-expression";
import transform_neume_sloppy_named_parameters from "../../../babel-plugins/babel-plugin-transform-neume-sloppy-named-parameters";

import "babel-polyfill";

export function executeCode(code, opts) {
  code = code.trim();

  if (code === "") {
    return Promise.resolve({ result: null });
  }

  const [ err1, transformed ] = transform(code, opts);

  if (err1 !== null) {
    return Promise.resolve({ error: err1 });
  }

  if (isElectron() && process.env.NODE_ENV === "development") {
    global.console.log(transformed);
  }

  const [ err2, result ] = execute(transformed);

  if (err2 !== null) {
    return Promise.resolve({ error: err2 });
  }

  return Promise.resolve({ result });
}

function transform(code) {
  try {
    const transformed = babel.transform(code, {
      presets: [
        stage_0
      ],
      plugins: [
        [ transform_es2015_classes, { loose: true } ],
        [ transform_es2015_block_scoping ],
        [ transform_neume_override_binary_expression ],
        [ transform_neume_sloppy_named_parameters ],
      ]
    }).code.replace(/^"use strict";$/gm, "").trim();

    return [ null, transformed ];
  } catch (error) {
    return [ error, null ];
  }
}

function execute(code) {
  try {
    const result = eval.call(null, code);

    return [ null, result ];
  } catch (error) {
    return [ error, null ];
  }
}
