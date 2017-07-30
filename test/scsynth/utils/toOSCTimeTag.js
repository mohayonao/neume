import assert from "assert";
import toOSCTimeTag from "../../../src/scsynth/utils/toOSCTimeTag";

describe("scsynth/utils/toOSCTimeTag(when)", () => {
  it("should return int64([ uint32, uint32 ])", () => {
    const when = 0;

    assert.deepEqual(toOSCTimeTag(when), [ 2208988800, 0 ]);
  });

  it("first item should be seconds from 1900-01-01 00:00:00", () => {
    const t0 = 1483196400; // 2017-01-01 00:00:00 (+09:00)

    assert.deepEqual(toOSCTimeTag(t0), [ 3692185200, 0 ]);
    assert.deepEqual(toOSCTimeTag(t0 + 10), [ 3692185200 + 10, 0 ]);
  });

  it("second item should be msec or less (unit: 2 ** -32 seconds)", () => {
    const when = 1483196410.5; // 2017-01-01 00:00:10 (+09:00) + 500msec

    assert.deepEqual(toOSCTimeTag(when), [ 3692185210, 2147483648 ]);
  });
});
