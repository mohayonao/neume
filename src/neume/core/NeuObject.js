import { EventEmitter } from "events";

export default class NeuObject {
  constructor(context) {
    Object.defineProperties(this, {
      context: desc(context),
      _: desc(Object.create(null)),
    });
    this._.emitter = new EventEmitter();
  }

  on(eventName, listener) {
    this._.emitter.on(eventName, listener);
    return this;
  }

  once(eventName, listener) {
    this._.emitter.once(eventName, listener);
    return this;
  }

  addListener(eventName, listener) {
    this._.emitter.addListener(eventName, listener);
    return this;
  }

  removeListener(eventName, listener) {
    this._.emitter.removeListener(eventName, listener);
    return this;
  }

  removeAllListeners(eventName) {
    this._.emitter.removeAllListeners(eventName);
    return this;
  }

  emit(eventName, ...args) {
    this._.emitter.emit(eventName, ...args);
    return this;
  }
}

function desc(value) {
  return {
    value, enumerable: false, writable: true, configurable: true
  };
}
