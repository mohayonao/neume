import { EventEmitter } from "events";
import isOSCBundle from "./utils/isOSCBundle";
import toOSCBundle from "./utils/toOSCBundle";
import toOSCSchedBundle from "./utils/toOSCSchedBundle";

export default class AbstractServer extends EventEmitter {
  constructor(commands) {
    super();

    this.commands = commands;
    this._syncId = 0;
    this._syncFn = new Map();
    this._bqueryFn = new Map();
  }

  allocBuffer(bufId, numberOfChannels, length, callback) {
    this._bqueryFn.set(bufId, callback);

    const next = this.commands.b_query(bufId);
    const cmd = this.commands.b_alloc(bufId, length, numberOfChannels, next);

    this.sendOSC(cmd);
  }

  loadBuffer(bufId, source, callback) {
    this._bqueryFn.set(bufId, callback);
    this._loadBuffer(bufId, source);
  }

  sendOSC(msg, callback) {
    if (typeof callback === "function") {
      msg = this._toSyncOSCMessage(msg, callback);
    }
    this._sendOSC(msg);
  }

  sendOSCAt(when, msg, callback) {
    this.sendOSC(toOSCSchedBundle(when, msg), callback);
  }

  recvOSC(msg) {
    if (isOSCBundle(msg)) {
      return msg.forEach((msg) => {
        this.recvOSC(msg);
      });
    }
    msg.args = msg.args.map(({ value }) => value);
    if (typeof this[msg.address] === "function") {
      this[msg.address](msg);
    }
    this.emit("recvOSC", msg);
  }

  _sendOSC() {
    throw new Error(`
      SubclassResponsibility: _sendOSC() should have been implemented by ${ this.constructor.name }.
    `.trim());
  }

  _toSyncOSCMessage(msg, callback) {
    const syncId = this._syncId++;

    this._syncFn.set(syncId, callback);

    return toOSCBundle(msg, this.commands.sync(syncId));
  }

  ["/synced"]({ args }) {
    const syncId = args[0];

    if (this._syncFn.has(syncId)) {
      this._syncFn.get(syncId)();
      this._syncFn.delete(syncId);
    }
  }

  ["/b_info"]({ args }) {
    const items = args.length / 4;

    for (let i = 0; i < items; i++) {
      const bufId = args[i * 4 + 0];
      const length = args[i * 4 + 1];
      const numberOfChannels = args[i * 4 + 2];
      const sampleRate = args[i * 4 + 3];

      if (this._bqueryFn.has(bufId)) {
        this._bqueryFn.get(bufId)({
          bufId, length, numberOfChannels, sampleRate
        });
        this._bqueryFn.delete(bufId);
      }
    }
  }
}
