import dgram from "dgram";
import OSCMessage from "osc-msg";
import AbstractServer from "./AbstractServer";
import * as commands from "./commands/binary";
import defaults from "./utils/defaults";

const SCSYNTH_DEFAULT_HOST = "127.0.0.1";
const SCSYNTH_DEFAULT_PORT = 57110;

export default class SCSynthServer extends AbstractServer {
  constructor(opts) {
    super(commands, opts);

    this._socket = dgram.createSocket("udp4");
    this._socket.on("message", (buffer) => {
      this.recvOSC(OSCMessage.decode(buffer));
    });
    this._host = defaults(opts.host, SCSYNTH_DEFAULT_HOST);
    this._port = defaults(opts.port, SCSYNTH_DEFAULT_PORT);
  }

  _loadBuffer(bufId, source) {
    const next = this.commands.b_query(bufId);
    const cmd = this.commands.b_allocRead(bufId, source, 0, 0, next);

    this.sendOSC(cmd);
  }

  _sendOSC(msg) {
    msg = OSCMessage.encode(msg);
    this._socket.send(msg, this._port, this._host);
  }
}
