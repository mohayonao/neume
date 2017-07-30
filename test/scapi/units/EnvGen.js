import assert from "assert";
import EnvGen from "../../../src/scapi/units/EnvGen";
import Env from "../../../src/scapi/units/Env";
import ref from "../../../src/scapi/api/ref";

describe("scapi/units/EnvGen", () => {
  it(".ar should create audio rate node", () => {
    const env = Env.perc(0.05, 2);
    const node = EnvGen.ar(env);

    assert.deepEqual(node, {
      type: "EnvGen", rate: "audio", props: [ 1, 1, 0, 1, 0 ].concat(env.valueOf())
    });
  });

  it(".kr should create control rate node", () => {
    const env = Env.perc(0.05, 2);
    const node = EnvGen.kr(env);

    assert.deepEqual(node, {
      type: "EnvGen", rate: "control", props: [ 1, 1, 0, 1, 0 ].concat(env.valueOf())
    });
  });

  it("default rate is control rate", () => {
    const env = Env.perc(0.05, 2);
    const node = EnvGen(env);

    assert.deepEqual(node, {
      type: "EnvGen", rate: "control", props: [ 1, 1, 0, 1, 0 ].concat(env.valueOf())
    });
  });

  it("should throw Error when given invalid envelope", () => {
    assert.throws(() => {
      EnvGen.kr(ref([ 0, 1, -99, -99 ]))
    }, TypeError, "wrong length");

    assert.throws(() => {
      EnvGen.kr(ref([ 0, 1, -99, -99, "1", "2", "5", "0" ]))
    }, TypeError, "includes not number");

    assert.throws(() => {
      EnvGen.kr(ref([ 0, 1, 100, -99, 1, 2, 5, 0 ]))
    }, TypeError, "invalid release node index");

    assert.throws(() => {
      EnvGen.kr(ref([ 0, 1, -99, 100, 1, 2, 5, 0 ]))
    }, TypeError, "invalid release node index");

    assert.throws(() => {
      EnvGen.kr(ref([ 0, 1, -99, -99, 1, 2, 100, 0 ]))
    }, TypeError, "invalid curve shape");
  });
});
