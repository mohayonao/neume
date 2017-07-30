const ADD_ACTION_DICT = Object.assign(Object.create(null), {
  0            : 0,
  "addToHead"  : 0,
  "addHead"    : 0,
  "head"       : 0,
  "h"          : 0,
  1            : 1,
  "addToTail"  : 1,
  "addTail"    : 1,
  "tail"       : 1,
  "t"          : 1,
  2            : 2,
  "addBefore"  : 2,
  "before"     : 2,
  "b"          : 2,
  3            : 3,
  "addAfter"   : 3,
  "after"      : 3,
  "a"          : 3,
  4            : 4,
  "addReplace" : 4,
  "replace"    : 4,
  "r"          : 4,
});

export default function toAddAction(addAction) {
  return ADD_ACTION_DICT[addAction] || 0;
}
