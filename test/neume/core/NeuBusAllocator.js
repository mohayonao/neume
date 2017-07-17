import assert from "assert";
import NeuBusAllocator from "../../../src/neume/core/NeuBusAllocator";
import NeuBus from "../../../src/neume/core/NeuBus";
import { AUDIO } from "../../../src/neume/constants";

describe("neume/core/BusAllocator", () => {
  describe("constructor(rate, length, offset)", () => {
    it("should create BusAllocator instance", () => {
      const context = {};
      const alloc = new NeuBusAllocator(context, AUDIO);

      assert(alloc instanceof NeuBusAllocator);
      assert(alloc.rate === AUDIO);
    });
  });

  describe(".alloc(channels)", () => {
    it("should allocate bus and return it", () => {
      const context = {};
      const alloc = new NeuBusAllocator(context, AUDIO, 100, 50);
      const bus1 = alloc.alloc(10);
      const bus2 = alloc.alloc(10);

      assert.deepEqual(bus1, new NeuBus(context, AUDIO, 50, 10));
      assert.deepEqual(bus2, new NeuBus(context, AUDIO, 60, 10));
    });

    it("should throw Error when bus is not empty", () => {
      const context = {};
      const alloc = new NeuBusAllocator(context, AUDIO, 100);

      const bus1 = alloc.alloc(25);
      const bus2 = alloc.alloc(25);
      const bus3 = alloc.alloc(25);
      const bus4 = alloc.alloc(25);

      assert.deepEqual(bus1, new NeuBus(context, AUDIO,  0, 25));
      assert.deepEqual(bus2, new NeuBus(context, AUDIO, 25, 25));
      assert.deepEqual(bus3, new NeuBus(context, AUDIO, 50, 25));
      assert.deepEqual(bus4, new NeuBus(context, AUDIO, 75, 25));

      assert.throws(() => {
        alloc.alloc(50);
      }, Error);
    });
  });

  describe(".free(bus)", () => {
    it("should free bus", () => {
      const context = {};
      const alloc = new NeuBusAllocator(context, AUDIO, 100, 50);
      const bus1 = alloc.alloc(10);
      const bus2 = alloc.alloc(10);

      alloc.free(bus1);
      alloc.free(bus2);
    });

    it("should throw Error when bus is not empty", () => {
      const context = {};
      const alloc = new NeuBusAllocator(context, AUDIO, 100);

      const bus1 = alloc.alloc(25);
      const bus2 = alloc.alloc(25);
      const bus3 = alloc.alloc(25);
      const bus4 = alloc.alloc(25);

      alloc.free(bus2);
      alloc.free(bus3);

      const bus5 = alloc.alloc(50);

      assert.deepEqual(bus1, new NeuBus(context, AUDIO,  0, 25));
      assert.deepEqual(bus4, new NeuBus(context, AUDIO, 75, 25));
      assert.deepEqual(bus5, new NeuBus(context, AUDIO, 25, 50));
    });
  });
});
