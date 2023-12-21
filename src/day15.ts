function log(u: unknown) {
  console.log(JSON.stringify(u, undefined, 2));
}

const test_input = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,
ot=9,ab=5,pc-,pc=6,ot=7`
  .replace('\n', '')
  .split(',');

const puzzle_input = `<get from aoc website>`
  .replace('\n', '')
  .replace('\r', '')
  .split(',');

const cache: Map<string, number> = new Map();

function hash(s: string, idx: number = 0, current: number = 0) {
  if (idx === s.length) {
    return current;
  }

  const key = s.substring(0, idx + 1);

  if (cache.has(key)) {
    const v = cache.get(key);
    if (v != null) {
      return hash(s, idx + 1, v);
    }
  }

  // Determine the ASCII code for the current character of the string.
  const c = s.charCodeAt(idx);
  // Increase the current value by the ASCII code you just determined.
  current += c;
  // Set the current value to itself multiplied by 17.
  current *= 17;
  // Set the current value to the remainder of dividing itself by 256.
  current %= 256;

  cache.set(key, current);

  return hash(s, idx + 1, current);
}

function part1(input: string[]) {
  const hashes = input.map((s) => hash(s));

  const total = hashes.reduce((a, c) => a + c);

  log(total);
}

type Lens = { label: string; value: string };

const boxes: Array<Array<Lens>> = new Array(256);

function part2(input: string[]) {
  // input is 4000 lenses, no need to optimize and complicate
  for (let i = 0; i < input.length; i++) {
    const [label, value] = input[i].split(/[-=]/);

    const boxNo = hash(label);
    if (input[i].includes('=')) {
      // new or replace
      const box = boxes[boxNo] ?? [];
      const idx = box.findIndex((l) => l.label === label);
      if (idx != -1) {
        box[idx] = { label, value };
      } else {
        box.push({ label, value });
      }
      boxes[boxNo] = box;
    }
    if (input[i].includes('-')) {
      // new or replace
      const box = boxes[boxNo] ?? [];
      const idx = box.findIndex((l) => l.label === label);
      if (idx != -1) {
        box.splice(idx, 1);
      }
      boxes[boxNo] = box;
    }
  }
  /*
    One plus the box number of the lens in question.
    The slot number of the lens within the box: 1 for the first lens, 2 for the second lens, and so on.
    The focal length of the lens.
    */
  const powers = boxes
    .map((b, i) => {
      if (b?.length > 0) {
        return b.reduce((a, c, j) => {
          return a + (i + 1) * (j + 1) * Number(c.value);
        }, 0);
      }
      return 0;
    })
    .filter(Boolean);

  const total = powers.reduce((a, c) => a + c);

  log(total);
}

// part1(puzzle_input);
part2(puzzle_input);
