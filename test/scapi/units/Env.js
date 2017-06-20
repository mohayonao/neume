import assert from "assert";
import Env from "../../../src/scapi/units/Env";

describe("scapi/units/Env", () => {
  it("should create envelope", () => {
    const levels = [ 0, 1, 0.5, 0 ];
    const times = [ 1, 2, 1 ];
    const node = Env(levels, times);
    const envArray = node.valueOf();

    assert.deepEqual(envArray, [
      0, 3, -99, -99, 1, 1, 1, 0, 0.5, 2, 1, 0, 0, 1, 1, 0
    ]);
  });

  it("should throw Error when given invalid values", () => {
    const levels = [ 0, 1, 0.5, 0 ];
    const times = [ 1, 2, 1, 2, 1, 2, 1 ];

    assert.throws(() => {
      Env(levels, times);
    }, Error);
  });

  it(".tri(dur, level) should create triangle envelope", () => {
    const node = Env.tri(2, 0.5);
    const envArray = node.valueOf();

    assert.deepEqual(envArray, [
      0, 2, -99, -99, 0.5, 1, 1, 0, 0, 1, 1, 0
    ]);
  });

  it(".sine(dur, level) should create sine envelope", () => {
    const node = Env.sine(2, 0.5);
    const envArray = node.valueOf();

    assert.deepEqual(envArray, [
      0, 2, -99, -99, 0.5, 1, 3, 0, 0, 1, 3, 0
    ]);
  });

  it(".perc(attackTime, releaseTime, level, curve) should create percussive envelope", () => {
    const node = Env.perc(0.05, 1, 1, -4);
    const envArray = node.valueOf();

    assert.deepEqual(envArray, [
      0, 2, -99, -99, 1, 0.05, 5, -4, 0, 1, 5, -4
    ]);
  });

  it(".linen(attackTime, sustainTime, releaseTime, level, curve) should create trapezoid envelope", () => {
    const node = Env.linen(0.1, 0.2, 0.1, 0.6);
    const envArray = node.valueOf();

    assert.deepEqual(envArray, [
      0, 3, -99, -99, 0.6, 0.1, 1, 0, 0.6, 0.2, 1, 0, 0, 0.1, 1, 0
    ]);
  });

  it(".step(levels, times, loopNode, releaseNode) should create step envelope", () => {
    const node = Env.step([ 0, 0.6, 0.4, 0 ], [ 0.05, 0.1, 0.3, 0.4 ]);
    const envArray = node.valueOf();

    assert.deepEqual(envArray, [
      0, 4, -99, -99, 0, 0.05, 0, 0, 0.6, 0.1, 0, 0, 0.4, 0.3, 0, 0, 0, 0.4, 0, 0
    ]);
  });

  it(".cutoff(releaseTime, level, curve) should create cutoff envelope", () => {
    const node = Env.cutoff(5, 0.5);
    const envArray = node.valueOf();

    assert.deepEqual(envArray, [
      0.5, 1, 0, -99, 0, 5, 1, 0
    ]);
  });

  it(".cutoff(releaseTime, level, curve) should create cutoff envelope (exp curve)", () => {
    const node = Env.cutoff(5, 0.5, "exp");
    const envArray = node.valueOf();

    assert.deepEqual(envArray, [
      0.5, 1, 0, -99, 1e-5, 5, 2, 0
    ]);
  });

  it(".dadsr(...) should create delay-attack-decay-sustain-release envelope", () => {
    const node = Env.dadsr(0.5, 0.02, 0.2, 0.25, 1, 1, -4);
    const envArray = node.valueOf();

    assert.deepEqual(envArray, [
      0, 4, 3, -99, 0, 0.5, 5, -4, 1, 0.02, 5, -4, 0.25, 0.2, 5, -4, 0, 1, 5, -4
    ]);
  });

  it(".adsr(...) should create attack-decay-sustain-release envelope", () => {
    const node = Env.adsr(0.02, 0.2, 0.25, 1, 1, -4);
    const envArray = node.valueOf();

    assert.deepEqual(envArray, [
      0, 3, 2, -99, 1, 0.02, 5, -4, 0.25, 0.2, 5, -4, 0, 1, 5, -4
    ]);
  });

  it(".asr(...) should create attack-sustain-release envelope", () => {
    const node = Env.asr(0.02, 0.5, 1, -4);
    const envArray = node.valueOf();

    assert.deepEqual(envArray, [
      0, 2, 1, -99, 0.5, 0.02, 5, -4, 0, 1, 5, -4
    ]);
  });
});
