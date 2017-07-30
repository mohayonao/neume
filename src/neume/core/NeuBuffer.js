import NeuObject from "../core/NeuObject";

export default class NeuBuffer extends NeuObject {
  static create(context, ...args) {
    return new NeuBuffer(...bindArgs(context, args));
  }

  constructor(context, bufId, numberOfChannels, length, source) {
    super(context);

    this.bufId = bufId;
    this.numberOfChannels = numberOfChannels;
    this.length = length;
    this.source = source;

    this._.state = "loading";

    const callback = ({ numberOfChannels, length, sampleRate }) => {
      this.numberOfChannels = numberOfChannels;
      this.length = length;
      this.sampleRate = sampleRate;
      /* istanbul ignore else */
      if (this._.state === "loading") {
        this._.state = "loaded";
      }
      this.emit("created", this);
      context.apiEmit("buffer-created", this);
    };

    if (source == null) {
      this.sampleRate = context.sampleRate;
      context.allocBuffer(bufId, numberOfChannels, length, callback);
    } else {
      this.sampleRate = 0;
      context.loadBuffer(bufId, source, callback);
    }
  }

  get state() {
    return this._.state;
  }

  free() {
    const { context } = this;
    const cmd = context.commands.b_free(this.bufId);

    context.sendOSC(cmd, () => {
      this.emit("disposed", this);
      context.apiEmit("buffer-disposed", this);
    });

    this._.state = "disposed";

    return this;
  }

  toSCNodeInput() {
    return this.bufId;
  }
}

export function bindArgs(context, args) {
  const hasSource = typeof args[args.length - 1] === "string";

  switch (args.length) {
  case 1:
    // (source)
    if (hasSource) {
      return [ context, context.nextBufId(), 0, 0, args[0] ];
    }
    // (length)
    if (typeof args[0] === "number") {
      return [ context, context.nextBufId(), 1, args[0], null ];
    }
    break;
  case 2:
    // (bufId, source)
    if (hasSource) {
      return [ context, args[0], 0, 0, args[1] ];
    }
    // (numberOfChannels, length)
    if (typeof args[0] === "number" && typeof args[1] === "number") {
      return [ context, context.nextBufId(), args[0], args[1], null ];
    }
    break;
  case 3:
    // (bufId, numberOfChannels, length)
    if (typeof args[0] === "number" && typeof args[1] === "number" && typeof args[2] === "number") {
      return [ context, args[0], args[1], args[2], null ];
    }
    break;
  }
  throw TypeError(`
    Provided parameters for Buffer constructor is invalid.
  `.trim());
}
