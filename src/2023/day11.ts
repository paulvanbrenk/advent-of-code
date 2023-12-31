function log(u: unknown) {
  console.log(JSON.stringify(u));
}

const test_input = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`.split('\n');

const puzzle_input = `<get from aoc website>`.split('\n');

function part1(input: string[], age: number) {
  const filledRow: boolean[] = new Array(input.length).fill(false);
  const filledCol: boolean[] = new Array(input[0].length).fill(false);

  const galaxies: [number, number][] = [];

  for (let i = 0; i < input.length; i++) {
    const r = input[i];
    for (let j = 0; j < r.length; j++) {
      const c = r[j];
      if (c === '#') {
        galaxies.push([i, j]);
        filledCol[j] = true;
        filledRow[i] = true;
      }
    }
  }

  const pairs: [[number, number], [number, number]][] = [];
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      pairs.push([galaxies[i], galaxies[j]]);
    }
  }

  const emptyRow = filledRow
    .map((v, i) => (v ? undefined : i))
    .filter((v) => v != null);
  const emptyCol = filledCol
    .map((v, i) => (v ? undefined : i))
    .filter((v) => v != null);

  log(emptyCol);
  log(emptyRow);

  const distances = pairs.map((p) => {
    const [f, s] = p;

    const [x1, y1] = f;
    const [x2, y2] = s;

    const t = Math.min(x1, x2);
    const b = Math.max(x1, x2);

    const dx =
      emptyRow.reduce((a, x) => {
        if (x != null && t < x && x < b) {
          return a == null ? 0 : a + age;
        }
        return a;
      }, 0) ?? 0;

    const l = Math.min(y1, y2);
    const r = Math.max(y1, y2);

    const dy =
      emptyCol.reduce((a, y) => {
        if (y != null && l < y && y < r) {
          return a == null ? 0 : a + age;
        }
        return a;
      }, 0) ?? 0;

    const dist = Math.abs(x1 - x2) + Math.abs(y1 - y2) + dx + dy;
    //  log(`${JSON.stringify(p)}>>${Math.abs(x1 - x2)}+ ${Math.abs(y1 - y2)} + ${dx} + ${dy}`);
    return dist;
  });

  log(distances.reduce((a, c) => a + c));
}

// part1(puzzle_input, 1);
part1(puzzle_input, 1000000 - 1);
