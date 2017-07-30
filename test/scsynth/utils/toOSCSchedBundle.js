import assert from "assert";
import toOSCSchedBundle from "../../../src/scsynth/utils/toOSCSchedBundle";
import toOSCTimeTag from "../../../src/scsynth/utils/toOSCTimeTag";

describe("scsynth/utils/toOSCSchedBundle(when, msg)", () => {
  it("should convert to OSC bundle from OSC message", () => {
    const when = Date.now() / 1000;
    const msg = {
      address: "/foo",
      args: [
        { type: "integer", value: 0 }
      ]
    };
    const bundle = toOSCSchedBundle(when, msg);

    assert.deepEqual(bundle, {
      timetag: toOSCTimeTag(when),
      elements: [ msg ]
    });
  });

  it("replace timetag when msg is bundle", () => {
    const when = Date.now() / 1000;
    const msg = {
      timetag: [ 0, 0 ],
      elements: [ {
        address: "/foo",
        args: [
          { type: "integer", value: 0 }
        ]
      } ]
    };
    const bundle = toOSCSchedBundle(when, msg);

    assert.deepEqual(bundle, {
      timetag: toOSCTimeTag(when),
      elements: msg.elements
    });
  });
});
