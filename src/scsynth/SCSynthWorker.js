/* eslint-env browser */

import AbstractServer from "./AbstractServer";
import * as commands from "./commands";

export default class SCSynthWorker extends AbstractServer {
  constructor(opts) {
    super(commands, opts);

    this._worker = new Worker(opts.workerPath);
    this._worker.onmessage = ({ data }) => {
      switch (data.type) {
      case "osc":
        return this.recvOSC(data.payload);
      }
    };
  }

  _sendOSC(msg) {
    this._worker.postMessage({ type: "osc", payload: msg });
  }
}
