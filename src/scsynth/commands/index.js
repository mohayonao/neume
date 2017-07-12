function $i(value) {
  return { type: "integer", value: value|0 };
}

function $f(value) {
  return { type: "float", value: +value };
}

function $s(value) {
  return { type: "string", value: "" + value };
}

function $b(value) {
  return { type: "blob", value };
}

function $map(values, types) {
  return values.map((value, index) => {
    return types[index % types.length](value);
  });
}

// Master Controls
export function notify(code) {
  return {
    address: "/notify",
    args: [ $i(code) ]
  };
}

export function status() {
  return {
    address: "/status"
  };
}

export function dumpOSC(code) {
  return {
    address: "/dumpOSC",
    args: [ $i(code) ]
  };
}

export function sync(syncId) {
  return {
    address: "/sync",
    args: [ $i(syncId) ]
  };
}

export function clearSched() {
  return {
    address: "/clearSched"
  };
}

// Synth Definition Commands
export function d_recv(sdef, next) {
  return {
    address: "/d_recv",
    args: [ $b(sdef) ].concat(
      next != null ? $b(next) : []
    )
  };
}

export function d_free(name, ...args) {
  return {
    address: "/d_free",
    args: [ $s(name) ].concat(
      $map(args, [ $s ])
    )
  };
}

// Node Commands
export function n_free(nodeId, ...args) {
  return {
    address: "/n_free",
    args: [ $i(nodeId) ].concat(
      $map(args, [ $i ])
    )
  };
}

export function n_run(nodeId, runFlag, ...args) {
  return {
    address: "/n_run",
    args: [ $i(nodeId), $i(runFlag) ].concat(
      $map(args, [ $i, $i ])
    )
  };
}

export function n_set(nodeId, ...args) {
  return {
    address: "/n_set",
    args: [ $i(nodeId) ].concat(args.map((value, index) => {
      if (index % 2 === 0) {
        return typeof value === "string" ? $s(value) : $i(value);
      }
      if (Array.isArray(value) && value.length !== 1) {
        return value.map($f);
      }
      return $f(+value);
    }))
  };
}

export function n_map(nodeId, ...args) {
  return {
    address: "/n_map",
    args: [ $i(nodeId) ].concat(args.map((value, index) => {
      if (index % 2 === 0) {
        return typeof value === "string" ? $s(value) : $i(value);
      }
      return $i(value);
    }))
  };
}

export function n_mapa(nodeId, ...args) {
  return {
    address: "/n_mapa",
    args: [ $i(nodeId) ].concat(args.map((value, index) => {
      if (index % 2 === 0) {
        return typeof value === "string" ? $s(value) : $i(value);
      }
      return $i(value);
    }))
  };
}

export function n_before(nodeId, targetId, ...args) {
  return {
    address: "/n_before",
    args: [ $i(nodeId), $i(targetId) ].concat(
      $map(args, [ $i, $i ])
    )
  };
}

export function n_after(nodeId, targetId, ...args) {
  return {
    address: "/n_after",
    args: [ $i(nodeId), $i(targetId) ].concat(
      $map(args, [ $i, $i ])
    )
  };
}

// Synth Commands
export function s_new(name, nodeId, addAction, targetId, ...args) {
  return {
    address: "/s_new",
    args: [ $s(name), $i(nodeId), $i(addAction), $i(targetId) ].concat(
      args.map((value, index) => {
        if (index % 2 === 0) {
          return typeof value === "string" ? $s(value) : $i(value);
        }
        if (Array.isArray(value) && value.length !== 1) {
          return value.map($f);
        }
        if (value && typeof value.type === "string") {
          return value;
        }
        return typeof value === "string" ? $s(value) : $f(+value);
      })
    )
  };
}

export function s_get(nodeId, ...args) {
  return {
    address: "/s_get",
    args: [ $i(nodeId) ].concat(
      args.map((value) => {
        return typeof value === "string" ? $s(value) : $i(value);
      })
    )
  };
}

// Group Commands
export function g_new(nodeId, addAction, targetId, ...args) {
  return {
    address: "/g_new",
    args: [ $i(nodeId), $i(addAction), $i(targetId) ].concat(
      $map(args, [ $i, $i, $i ])
    )
  };
}

export function g_head(nodeId, targetId, ...args) {
  return {
    address: "/g_head",
    args: [ $i(nodeId), $i(targetId) ].concat(
      $map(args, [ $i, $i ])
    )
  };
}

export function g_tail(nodeId, targetId, ...args) {
  return {
    address: "/g_tail",
    args: [ $i(nodeId), $i(targetId) ].concat(
      $map(args, [ $i, $i ])
    )
  };
}

export function g_freeAll(groupId, ...args) {
  return {
    address: "/g_freeAll",
    args: [ $i(groupId) ].concat(
      $map(args, [ $i ])
    )
  };
}

export function g_deepFree(groupId, ...args) {
  return {
    address: "/g_deepFree",
    args: [ $i(groupId) ].concat(
      $map(args, [ $i ])
    )
  };
}

// Buffer Commands
export function b_alloc(bufId, length, numberOfChannels, next) {
  return {
    address: "/b_alloc",
    args: [ $i(bufId), $i(length), $i(numberOfChannels) ].concat(
      next != null ? $b(next) : []
    )
  };
}

export function b_allocRead(bufId, source, offset, length, next) {
  return {
    address: "/b_allocRead",
    args: [ $i(bufId), $s(source), $i(offset), $i(length) ].concat(
      next != null ? $b(next) : []
    )
  };
}

export function b_free(bufId, next) {
  return {
    address: "/b_free",
    args: [ $i(bufId) ].concat(
      next != null ? $b(next) : []
    )
  };
}

export function b_zero(bufId, next) {
  return {
    address: "/b_zero",
    args: [ $i(bufId) ].concat(
      next != null ? $b(next) : []
    )
  };
}

export function b_query(bufId, ...args) {
  return {
    address: "/b_query",
    args: [ $i(bufId) ].concat(
     $map(args, [ $i ])
    )
  };
}

// Control Bus Commands
export function c_set(index, value, ...args) {
  return {
    address: "/c_set",
    args: [ $i(index), $f(value) ].concat(
      $map(args, [ $i, $f ])
    )
  };
}

export function c_get(index, ...args) {
  return {
    address: "/c_get",
    args: [ $i(index) ].concat(
      $map(args, [ $i ])
    )
  };
}
