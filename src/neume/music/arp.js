import note from "./note";

export default function arp(noteNumbers, style, length = -1, distance = 0) {
  if (typeof noteNumbers === "string") {
    noteNumbers = note(noteNumbers);
  }

  const indices = arpIndex(style, noteNumbers.length);

  if (length === -1) {
    length = indices.length;
  }

  return Array.from({ length }, (_, index) => {
    const i = Math.floor(index % indices.length);
    const j = Math.floor(index / indices.length);

    return noteNumbers[indices[i]] + j * distance;
  });
}

export function arpIndex(style, length) {
  switch (style.toLowerCase()) {
  case "up":
    return Array.from({ length }, (_, i) => i);
  case "down":
    return Array.from({ length }, (_, i) => length - i - 1);
  case "updown":
    return arpIndex("up", length).concat(arpIndex("down", length).slice(1, -1));
  case "downup":
    return arpIndex("down", length).concat(arpIndex("up", length).slice(1, -1));
  case "up&down":
    return arpIndex("up", length).concat(arpIndex("down", length));
  case "down&up":
    return arpIndex("down", length).concat(arpIndex("up", length));
  case "converge":
    return Array.from({ length }, (_, i) => {
      return i % 2 ? length - Math.floor(i / 2) - 1 : i / 2;
    });
  case "diverge":
    return arpIndex("converge", length).reverse();
  case "con&diverge":
    return arpIndex("converge", length).concat(arpIndex("diverge", length).slice(1, -1));
  case "pinky up":
    return Array.from({ length: length * 2 - 2 }, (_, i) => {
      return i % 2 ? length - 1 : i / 2;
    });
  case "pinky updown":
    return arpIndex("pinky up", length).concat(arpIndex("pinky up", length).reverse().slice(3, -1));
  case "thumb up":
    return Array.from({ length: length * 2 - 2 }, (_, i) => {
      return i % 2 ? Math.ceil(i / 2) : 0;
    });
  case "thumb updown":
    return arpIndex("thumb up", length).concat(arpIndex("thumb up", length).reverse().slice(1, -3));
  }
  throw new TypeError(`
    unknown arp style: '${ style }'
  `.trim());
}
