const test_input = `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`.split('\n');

const puzzle_input = `<get from aoc website>`.split('\n');

function log(u: unknown) {
  console.log(JSON.stringify(u, undefined, 2));
}

type Coords = [row: number, col: number];

function printGrid(coords: Coords[]) {
  const max = coords.reduce((a, c) => Math.max(a, c[0], c[1]), 0) + 1;

  const output: string[][] = new Array(max);
  for (let i = 0; i < output.length; i++) {
    output[i] = new Array(max).fill('.');
  }

  for (let i = 1; i < coords.length; i++) {
    const [x1, y1] = coords[i - 1];
    const [x2, y2] = coords[i];
    let start = Math.min(x1, x2);
    let end = Math.max(x1, x2);
    while (start <= end) {
      output[start][y1] = '#';
      start++;
    }
    start = Math.min(y1, y2);
    end = Math.max(y1, y2);
    while (start <= end) {
      output[x1][start] = '#';
      start++;
    }
  }

  log({ o: output.map((r) => r.join('')) });
}

function part1(input: string[]) {
  let circ = 0;

  const coords = input.reduce<Coords[]>(
    (acc, line) => {
      const [d, c] = line.split(' ');

      const cnt = Number(c);
      circ += Math.abs(cnt);

      const [vert, hor] = acc[acc.length - 1];
      switch (d) {
        case 'R': // right ++
          acc.push([vert, hor + cnt]);
          break;
        case 'L': // left --
          acc.push([vert, hor - cnt]);
          break;
        case 'U': // up --
          acc.push([vert - cnt, hor]);
          break;
        case 'D': // down ++
          acc.push([vert + cnt, hor]);
          break;
      }

      return acc;
    },
    [[0, 0]],
  );

  let surface = 0;
  for (let i = 1; i < coords.length; i++) {
    const [x1, y1] = coords[i - 1];
    const [x2, y2] = coords[i];

    surface += (x1 * y2 - x2 * y1) / 2;
  }

  log({ circ, surface });

  log(Math.abs(surface) + circ / 2 + 1);
}

function part2(input: string[]) {
  let circ = 0;

  const coords = input.reduce<Coords[]>(
    (acc, line) => {
      const code = line.split(' ')[2];
      const c = code.substring(2, 7);
      const d = code[7];

      const cnt = Number.parseInt(c, 16);
      circ += Math.abs(cnt);

      const [vert, hor] = acc[acc.length - 1];
      switch (d) {
        case '0': // right ++
          acc.push([vert, hor + cnt]);
          break;
        case '2': // left --
          acc.push([vert, hor - cnt]);
          break;
        case '3': // up --
          acc.push([vert - cnt, hor]);
          break;
        case '1': // down ++
          acc.push([vert + cnt, hor]);
          break;
      }

      return acc;
    },
    [[0, 0]],
  );

  let surface = 0;
  for (let i = 1; i < coords.length; i++) {
    const [x1, y1] = coords[i - 1];
    const [x2, y2] = coords[i];

    surface += (x1 * y2 - x2 * y1) / 2;
  }

  log({ circ, surface });

  log(Math.abs(surface) + circ / 2 + 1);
}

// part1(test_input);
// part1(puzzle_input);

part2(test_input);
part2(puzzle_input);
