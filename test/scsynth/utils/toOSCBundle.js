import assert from "assert";
import toOSCBundle from "../../../src/scsynth/utils/toOSCBundle";

describe("scsynth/utils/toOSCBundle(bundle, value)", () => {
  it("should convert to OSC bundle from OSC messages", () => {
    const msg1 = { address: "/foo" };
    const msg2 = { address: "/bar" };
    const bundle = toOSCBundle(msg1, msg2);

    assert.deepEqual(bundle, {
      timetag: [ 0, 1 ],
      elements: [ msg1, msg2 ]
    });
  });

  it("should append OSC message to OSC bundle", () => {
    const msg1 = { address: "/foo" };
    const msg2 = { address: "/bar" };
    const bundle = toOSCBundle({ timetag: [ 0, 1 ], elements: [ msg1 ] }, msg2);

    assert.deepEqual(bundle, {
      timetag: [ 0, 1 ],
      elements: [ msg1, msg2 ]
    });
  });
});
