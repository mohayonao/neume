import NeuObject from "../core/NeuObject";
import NeuBus from "../core/NeuBus";

export default class NeuBusAllocator extends NeuObject {
  constructor(context, rate, length = 1024, offset = 0) {
    super(context);

    this.rate = rate;
    this.length = length;
    this.offset = offset;
    this._.mem = new Uint8Array(length - offset);
    this._.pos = 0;
  }

  alloc(length) {
    const pos = this._findAvailablePos(this._.pos, length);

    if (pos === -1) {
      throw new Error(`
        BusIndexAllocator Error
      `.trim());
    }

    for (let i = 0; i < length; i++) {
      this._.mem[pos + i] = 1;
    }
    this._.pos = pos + length;

    const rate = this.rate;
    const index = pos + this.offset;

    return new NeuBus(this.context, rate, index, length);
  }

  free({ index, length }) {
    const pos = index - this.offset;

    for (let i = 0; i < length; i++) {
      this._.mem[pos + i] = 0;
    }
  }

  _findAvailablePos(startIndex, length) {
    const mem = this._.mem;

    loop: for (let i = 0, imax = mem.length - length; i < imax; i++) {
      const pos = (startIndex + i) % mem.length;

      for (let j = 0; j < length; j++) {
        if (mem[pos + j]) {
          i += j;
          continue loop;
        }
      }

      return pos;
    }

    return -1;
  }
}
