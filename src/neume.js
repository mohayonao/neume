import scapi from "./scapi";
import * as constants from "./neume/constants";
import * as musicAPI from "./neume/music";
import * as patternAPI from "./neume/pattern";

import NeuContext from "./neume/core/NeuContext";
import NeuObject from "./neume/core/NeuObject";

const defaultOpts = {};

export default function(selectServerClass) {
  function neume(opts) {
    const context = createContext(opts, selectServerClass);
    const api = createAPI(context);

    context.on("api-emit", ({ event, payload }) => {
      api.emit(event, payload);
    });

    // FIXME: access to a private member..
    context._.timeline.start();

    return api;
  }

  return neume;
}

function createContext(opts, selectServerClass) {
  opts = Object.assign({}, defaultOpts, opts);

  if (opts.ServerClass == null) {
    opts.ServerClass = selectServerClass(opts);
  }

  return new NeuContext(opts);
}

function createAPI(context) {
  return Object.assign(new NeuObject(null),
    constants, context.createAPI(), musicAPI, patternAPI, { scapi }
  );
}
