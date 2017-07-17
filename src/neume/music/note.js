const major  = [ 0, 4, 7 ];
const minor  = [ 0, 3, 7 ];
const major7 = [ 0, 4, 7, 11 ];
const dom7   = [ 0, 4, 7, 10 ];
const minor7 = [ 0, 3, 7, 10 ];
const aug    = [ 0, 4, 8 ];
const dim    = [ 0, 3, 6 ];
const dim7   = [ 0, 3, 6, 9 ];

const CHORD = {
  "1"     : [ 0 ],
  "5"     : [ 0, 7 ],
  "+5"    : [ 0, 4, 8 ],
  "m+5"   : [ 0, 3, 8 ],
  "sus2"  : [ 0, 2, 7 ],
  "sus4"  : [ 0, 5, 7 ],
  "6"     : [ 0, 4, 7, 9 ],
  "m6"    : [ 0, 3, 7, 9 ],
  "7sus2" : [ 0, 2, 7, 10 ],
  "7sus4" : [ 0, 5, 7, 10 ],
  "7-5"   : [ 0, 4, 6, 10 ],
  "m7-5"  : [ 0, 3, 6, 10 ],
  "7+5"   : [ 0, 4, 8, 10 ],
  "m7+5"  : [ 0, 3, 8, 10 ],
  "9"     : [ 0, 4, 7, 10, 14 ],
  "m9"    : [ 0, 3, 7, 10, 14 ],
  "m7+9"  : [ 0, 3, 7, 10, 14 ],
  "maj9"  : [ 0, 4, 7, 11, 14 ],
  "9sus4" : [ 0, 5, 7, 10, 14 ],
  "6*9"   : [ 0, 4, 7, 9, 14 ],
  "m6*9"  : [ 0, 3, 9, 7, 14 ],
  "7-9"   : [ 0, 4, 7, 10, 13 ],
  "m7-9"  : [ 0, 3, 7, 10, 13 ],
  "7-10"  : [ 0, 4, 7, 10, 15 ],
  "9+5"   : [ 0, 10, 13 ],
  "m9+5"  : [ 0, 10, 14 ],
  "7+5-9" : [ 0, 4, 8, 10, 13 ],
  "m7+5-9": [ 0, 3, 8, 10, 13 ],
  "11"    : [ 0, 4, 7, 10, 14, 17 ],
  "m11"   : [ 0, 3, 7, 10, 14, 17 ],
  "maj11" : [ 0, 4, 7, 11, 14, 17 ],
  "11+"   : [ 0, 4, 7, 10, 14, 18 ],
  "m11+"  : [ 0, 3, 7, 10, 14, 18 ],
  "13"    : [ 0, 4, 7, 10, 14, 17, 21 ],
  "m13"   : [ 0, 3, 7, 10, 14, 17, 21 ],
  "major" : major,
  "M"     : major,
  "minor" : minor,
  "m"     : minor,
  "major7": major7,
  "dom7"  : dom7,
  "7"     : dom7,
  "M7"    : major7,
  "minor7": minor7,
  "m7"    : minor7,
  "augmented": aug,
  "aug"   : aug,
  "a"     : aug,
  "diminished": dim,
  "dim"   : dim,
  "i"     : dim,
  "diminished7": dim7,
  "dim7"  : dim7,
  "i7"    : dim7,
};

export default function note(...args) {
  switch (args.length) {
  case 1:
    if (args[0] === null || Number.isFinite(args[0])) {
      // (noteNumber)
      return args[0];
    }
    if (typeof args[0] === "string") {
      // ("noteName(chordName)")
      if (args[0].includes("(")) {
        const [ noteName, chordName ] = args[0].split("(");

        return toChordNoteNumbers(toNoteNumber(noteName), chordName.slice(0, -1));
      }
      // ("noteName")
      if (/[a-g]/i.test(args[0].charAt(0))) {
        return toNoteNumber(args[0]);
      }

      // ("chordName")
      return toChordNoteNumbers(0, args[0], 0);
    }
    break;
  case 2:
    if (typeof args[1] === "string") {
      // (noteNumber, "chordName")
      return toChordNoteNumbers(note(args[0]), args[1], 0);
    }
    // (noteName|chordName, inversion)
    return invertChord(note(args[0]), args[1]|0);
  case 3:
    // array.map?
    if (typeof args[1] === "number" && Array.isArray(args[2])) {
      return note(args[0]);
    }
    // (noteNumber, chordName, inversion)
    return invertChord(toChordNoteNumbers(note(args[0]), args[1]), args[2]);
  }

  throw new TypeError(`
    failed to parse note notation
  `.trim());
}

function toNoteNumber(noteName) {
  let noteNumber;

  noteNumber = [ 9, 11, 0, 2, 4, 5, 7 ][noteName.toLowerCase().charCodeAt(0) - 97];

  if (noteName.length !== 1) {
    noteNumber += { "-": -1, "+": +1, "b": -1, "#": +1 }[noteName.charAt(1)]|0;
    noteNumber += (noteName.charAt(noteName.length - 1)|0) * 12 + 12;
  }

  return noteNumber;
}

function toChordNoteNumbers(noteNumber, chordName) {
  const nums = CHORD[chordName];

  if (Array.isArray(nums)) {
    return nums.map(i => i + noteNumber);
  }

  throw new TypeError(`
    failed to parse note notation
  `.trim());
}

function invertChord(noteNumbers, inversion) {
  if (inversion === 0) {
    return noteNumbers;
  } else if (0 < inversion) {
    while (inversion--) {
      noteNumbers.push(noteNumbers.shift() + 12);
    }
  } else {
    while (inversion++) {
      noteNumbers.unshift(noteNumbers.pop() - 12);
    }
  }
  return noteNumbers;
}
