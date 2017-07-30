import assert from "assert";
import SDefEncoder from "synthdef-json-encoder";
import OSCMessage from "osc-msg";
import * as commands from "../../../src/scsynth/commands/binary";

function $i(value) {
  return { type: "integer", value };
}

describe("scsynth/commands/binary", () => {
  it("/notify", () => {
    const msg = commands.notify(1);

    assert.deepEqual(msg, {
      address: "/notify",
      args: [
        { type: "integer", value: 1 }
      ]
    });
  });

  it("/status", () => {
    const msg = commands.status();

    assert.deepEqual(msg, {
      address: "/status"
    });
  });

  it("/dumpOSC", () => {
    const msg = commands.dumpOSC(1);

    assert.deepEqual(msg, {
      address: "/dumpOSC",
      args: [
        { type: "integer", value: 1 }
      ]
    });
  });

  it("/sync", () => {
    const msg = commands.sync(1000);

    assert.deepEqual(msg, {
      address: "/sync",
      args: [
        { type: "integer", value: 1000 }
      ]
    });
  });

  it("/clearSched", () => {
    const msg = commands.clearSched();

    assert.deepEqual(msg, {
      address: "/clearSched"
    });
  });

  it("/d_recv", () => {
    const sdef = { name: "temp", consts: [], units: [] };
    const msg = commands.d_recv(sdef);

    assert.deepEqual(msg, {
      address: "/d_recv",
      args: [
        { type: "blob", value: SDefEncoder.encode(sdef) },
      ]
    });
  });

  it("/d_recv with next command", () => {
    const sdef = { name: "temp", consts: [], units: [] };
    const msg = commands.d_recv(sdef, {
      address: "/next"
    });

    assert.deepEqual(msg, {
      address: "/d_recv",
      args: [
        { type: "blob", value: SDefEncoder.encode(sdef) },
        { type: "blob", value: OSCMessage.encode({ address: "/next" }) },
      ]
    });
  });

  it("/d_free", () => {
    const msg = commands.d_free("foo", "bar", "baz");

    assert.deepEqual(msg, {
      address: "/d_free",
      args: [
        { type: "string", value: "foo" },
        { type: "string", value: "bar" },
        { type: "string", value: "baz" },
      ]
    });
  });

  it("/n_free", () => {
    const msg = commands.n_free(1, 2, 3);

    assert.deepEqual(msg, {
      address: "/n_free",
      args: [
        { type: "integer", value: 1 },
        { type: "integer", value: 2 },
        { type: "integer", value: 3 },
      ]
    });
  });

  it("/n_run", () => {
    const msg = commands.n_run(1001, 0, 1002, 1);

    assert.deepEqual(msg, {
      address: "/n_run",
      args: [
        { type: "integer", value: 1001 },
        { type: "integer", value:    0 },
        { type: "integer", value: 1002 },
        { type: "integer", value:    1 },
      ]
    });
  });

  it("/n_set", () => {
    const msg = commands.n_set(1001, 0, 440, 1, 0.2);

    assert.deepEqual(msg, {
      address: "/n_set",
      args: [
        { type: "integer", value: 1001   },
        { type: "integer", value:    0   },
        { type: "float"  , value:  440   },
        { type: "integer", value:    1   },
        { type: "float"  , value:    0.2 },
      ]
    });
  });

  it("/n_set name", () => {
    const msg = commands.n_set(1001, "freq", 440, "volume", 0.2);

    assert.deepEqual(msg, {
      address: "/n_set",
      args: [
        { type: "integer", value: 1001     },
        { type: "string" , value: "freq"   },
        { type: "float"  , value:  440     },
        { type: "string" , value: "volume" },
        { type: "float"  , value:    0.2   },
      ]
    });
  });

  it("/n_set array", () => {
    const msg = commands.n_set(1001, "freq", [ 440, 442 ], "volume", [ 0.2 ]);

    assert.deepEqual(msg, {
      address: "/n_set",
      args: [
        { type: "integer", value: 1001     },
        { type: "string" , value: "freq"   },
        [
          { type: "float"  , value:  440     },
          { type: "float"  , value:  442     },
        ],
        { type: "string" , value: "volume" },
        { type: "float"  , value:    0.2   },
      ]
    });
  });

  it("/n_map", () => {
    const msg = commands.n_map(1001, 0, 1, 2, 3);

    assert.deepEqual(msg, {
      address: "/n_map",
      args: [
        { type: "integer", value: 1001 },
        { type: "integer", value:    0 },
        { type: "integer", value:    1 },
        { type: "integer", value:    2 },
        { type: "integer", value:    3 },
      ]
    });
  });

  it("/n_map name", () => {
    const msg = commands.n_map(1001, "freq", 1, "volume", 3);

    assert.deepEqual(msg, {
      address: "/n_map",
      args: [
        { type: "integer", value: 1001 },
        { type: "string" , value: "freq" },
        { type: "integer", value:    1 },
        { type: "string" , value: "volume" },
        { type: "integer", value:    3 },
      ]
    });
  });

  it("/n_mapa", () => {
    const msg = commands.n_mapa(1001, 0, 1, 2, 3);

    assert.deepEqual(msg, {
      address: "/n_mapa",
      args: [
        { type: "integer", value: 1001 },
        { type: "integer", value:    0 },
        { type: "integer", value:    1 },
        { type: "integer", value:    2 },
        { type: "integer", value:    3 },
      ]
    });
  });

  it("/n_mapa name", () => {
    const msg = commands.n_mapa(1001, "freq", 1, "volume", 3);

    assert.deepEqual(msg, {
      address: "/n_mapa",
      args: [
        { type: "integer", value: 1001 },
        { type: "string" , value: "freq" },
        { type: "integer", value:    1 },
        { type: "string" , value: "volume" },
        { type: "integer", value:    3 },
      ]
    });
  });

  it("/n_before", () => {
    const msg = commands.n_before(1001, 1, 1002, 2);

    assert.deepEqual(msg, {
      address: "/n_before",
      args: [
        { type: "integer", value: 1001 },
        { type: "integer", value:    1 },
        { type: "integer", value: 1002 },
        { type: "integer", value:    2 },
      ]
    });
  });

  it("/n_after", () => {
    const msg = commands.n_after(1001, 1, 1002, 2);

    assert.deepEqual(msg, {
      address: "/n_after",
      args: [
        { type: "integer", value: 1001 },
        { type: "integer", value:    1 },
        { type: "integer", value: 1002 },
        { type: "integer", value:    2 },
      ]
    });
  });

  it("/s_new", () => {
    const msg = commands.s_new("foo", 1001, 0, 1, 0, 440, 1, 0.2);

    assert.deepEqual(msg, {
      address: "/s_new",
      args: [
        { type: "string" , value: "foo" },
        { type: "integer", value:  1001 },
        { type: "integer", value:     0 },
        { type: "integer", value:     1 },
        { type: "integer", value:     0 },
        { type: "float"  , value:   440 },
        { type: "integer", value:     1 },
        { type: "float"  , value:   0.2 },
      ]
    });
  });

  it("/s_new name", () => {
    const msg = commands.s_new("foo", 1001, 0, 1, "freq", 440, "volume", 0.2);

    assert.deepEqual(msg, {
      address: "/s_new",
      args: [
        { type: "string" , value: "foo"    },
        { type: "integer", value:  1001    },
        { type: "integer", value:     0    },
        { type: "integer", value:     1    },
        { type: "string" , value: "freq"   },
        { type: "float"  , value:   440    },
        { type: "string" , value: "volume" },
        { type: "float"  , value:     0.2  },
      ]
    });
  });

  it("/s_new array", () => {
    const msg = commands.s_new("foo", 1001, 0, 1, "freq", [ 440, 442 ], "volume", [ 0.2 ]);

    assert.deepEqual(msg, {
      address: "/s_new",
      args: [
        { type: "string" , value: "foo"    },
        { type: "integer", value:  1001    },
        { type: "integer", value:     0    },
        { type: "integer", value:     1    },
        { type: "string" , value: "freq"   },
        [
          { type: "float"  , value:   440    },
          { type: "float"  , value:   442    },
        ],
        { type: "string" , value: "volume" },
        { type: "float"  , value:     0.2  },
      ]
    });
  });

  it("/s_new bus index", () => {
    const msg = commands.s_new("foo", 1001, 0, 1, "freq", $i(0), "volume", $i(1));

    assert.deepEqual(msg, {
      address: "/s_new",
      args: [
        { type: "string" , value: "foo"    },
        { type: "integer", value:  1001    },
        { type: "integer", value:     0    },
        { type: "integer", value:     1    },
        { type: "string" , value: "freq"   },
        { type: "integer", value:     0    },
        { type: "string" , value: "volume" },
        { type: "integer", value:     1    },
      ]
    });
  });

  it("/s_new bus name", () => {
    const msg = commands.s_new("foo", 1001, 0, 1, "freq", "c0", "volume", "c1");

    assert.deepEqual(msg, {
      address: "/s_new",
      args: [
        { type: "string" , value: "foo"    },
        { type: "integer", value:  1001    },
        { type: "integer", value:     0    },
        { type: "integer", value:     1    },
        { type: "string" , value: "freq"   },
        { type: "string" , value: "c0"     },
        { type: "string" , value: "volume" },
        { type: "string" , value: "c1"     },
      ]
    });
  });

  it("/s_get", () => {
    const msg = commands.s_get(1001, 0, 2);

    assert.deepEqual(msg, {
      address: "/s_get",
      args: [
        { type: "integer", value: 1001 },
        { type: "integer", value:    0 },
        { type: "integer", value:    2 },
      ]
    });
  });

  it("/s_get name", () => {
    const msg = commands.s_get(1001, "freq", "volume");

    assert.deepEqual(msg, {
      address: "/s_get",
      args: [
        { type: "integer", value: 1001 },
        { type: "string" , value: "freq"   },
        { type: "string" , value: "volume" },
      ]
    });
  });

  it("/g_new", () => {
    const msg = commands.g_new(1001, 0, 1, 1002, 1, 1001);

    assert.deepEqual(msg, {
      address: "/g_new",
      args: [
        { type: "integer", value: 1001 },
        { type: "integer", value:    0 },
        { type: "integer", value:    1 },
        { type: "integer", value: 1002 },
        { type: "integer", value:    1 },
        { type: "integer", value: 1001 },
      ]
    });
  });

  it("/g_head", () => {
    const msg = commands.g_head(1001, 0, 1002, 0);

    assert.deepEqual(msg, {
      address: "/g_head",
      args: [
        { type: "integer", value: 1001 },
        { type: "integer", value:    0 },
        { type: "integer", value: 1002 },
        { type: "integer", value:    0 },
      ]
    });
  });

  it("/g_tail", () => {
    const msg = commands.g_tail(1001, 0, 1002, 0);

    assert.deepEqual(msg, {
      address: "/g_tail",
      args: [
        { type: "integer", value: 1001 },
        { type: "integer", value:    0 },
        { type: "integer", value: 1002 },
        { type: "integer", value:    0 },
      ]
    });
  });

  it("/g_freeAll", () => {
    const msg = commands.g_freeAll(0, 1001);

    assert.deepEqual(msg, {
      address: "/g_freeAll",
      args: [
        { type: "integer", value:    0 },
        { type: "integer", value: 1001 },
      ]
    });
  });

  it("/g_deepFree", () => {
    const msg = commands.g_deepFree(0, 1001);

    assert.deepEqual(msg, {
      address: "/g_deepFree",
      args: [
        { type: "integer", value:    0 },
        { type: "integer", value: 1001 },
      ]
    });
  });

  it("/b_alloc", () => {
    const msg = commands.b_alloc(0, 1024, 2);

    assert.deepEqual(msg, {
      address: "/b_alloc",
      args: [
        { type: "integer", value:    0 },
        { type: "integer", value: 1024 },
        { type: "integer", value:    2 },
      ]
    });
  });

  it("/b_alloc with next command", () => {
    const msg = commands.b_alloc(0, 1024, 2, {
      address: "/next"
    });

    assert.deepEqual(msg, {
      address: "/b_alloc",
      args: [
        { type: "integer", value:    0 },
        { type: "integer", value: 1024 },
        { type: "integer", value:    2 },
        { type: "blob"   , value: OSCMessage.encode({ address: "/next" }) },
      ]
    });
  });

  it("/b_allocRead", () => {
    const msg = commands.b_allocRead(0, "/path/to/source", 0, 44100);

    assert.deepEqual(msg, {
      address: "/b_allocRead",
      args: [
        { type: "integer", value:     0 },
        { type: "string" , value: "/path/to/source" },
        { type: "integer", value:     0 },
        { type: "integer", value: 44100 },
      ]
    });
  });

  it("/b_allocRead with next command", () => {
    const msg = commands.b_allocRead(0, "/path/to/source", 0, 44100, {
      address: "/next"
    });

    assert.deepEqual(msg, {
      address: "/b_allocRead",
      args: [
        { type: "integer", value:     0 },
        { type: "string" , value: "/path/to/source" },
        { type: "integer", value:     0 },
        { type: "integer", value: 44100 },
        { type: "blob"   , value: OSCMessage.encode({ address: "/next" }) },
      ]
    });
  });

  it("/b_free", () => {
    const msg = commands.b_free(0);

    assert.deepEqual(msg, {
      address: "/b_free",
      args: [
        { type: "integer", value: 0 },
      ]
    });
  });

  it("/b_free with next command", () => {
    const msg = commands.b_free(0, {
      address: "/next"
    });

    assert.deepEqual(msg, {
      address: "/b_free",
      args: [
        { type: "integer", value: 0 },
        { type: "blob"   , value: OSCMessage.encode({ address: "/next" }) },
      ]
    });
  });

  it("/b_zero", () => {
    const msg = commands.b_zero(0);

    assert.deepEqual(msg, {
      address: "/b_zero",
      args: [
        { type: "integer", value: 0 },
      ]
    });
  });

  it("/b_zero with next command", () => {
    const msg = commands.b_zero(0, {
      address: "/next"
    });

    assert.deepEqual(msg, {
      address: "/b_zero",
      args: [
        { type: "integer", value: 0 },
        { type: "blob"   , value: OSCMessage.encode({ address: "/next" }) },
      ]
    });
  });

  it("/b_query", () => {
    const msg = commands.b_query(0);

    assert.deepEqual(msg, {
      address: "/b_query",
      args: [
        { type: "integer", value: 0 },
      ]
    });
  });

  it("/c_set", () => {
    const msg = commands.c_set(0, 440, 1, 880);

    assert.deepEqual(msg, {
      address: "/c_set",
      args: [
        { type: "integer", value:   0 },
        { type: "float"  , value: 440 },
        { type: "integer", value:   1 },
        { type: "float"  , value: 880 },
      ]
    });
  });

  it("/c_get", () => {
    const msg = commands.c_get(0, 1);

    assert.deepEqual(msg, {
      address: "/c_get",
      args: [
        { type: "integer", value: 0 },
        { type: "integer", value: 1 },
      ]
    });
  });
});
