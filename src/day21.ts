const puzzle_input = `get from advent of code`.split('\n');

function log(u: unknown) {
  console.log(JSON.stringify(u, undefined, 2));
}

type Coords = [row: number, col: number];

function printGrid(input: string[], coords: Coords[]) {
  const output = input.map((r) => r.split(''));

  coords.forEach((c) => (output[c[0]][c[1]] = 'O'));

  log({ o: output.map((r) => r.join('')) });
}

const test_input = `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`.split('\n');

const directions: Array<Coords> = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

const CtoS = (c: Coords) => `${c[0]},${c[1]}`;
const StoC: (s: string) => Coords = (s: string) => {
  const [x, y] = s.split(',').map(Number);
  return [x, y];
};

function doStep(positions: Set<string>, isValid: (c: Coords) => boolean) {
  const newPositions: Set<string> = new Set();

  const next: Array<Coords> = [];
  for (const r of positions) {
    const [x, y] = StoC(r);

    directions
      .map<Coords>((d) => [x + d[0], y + d[1]])
      .filter(isValid)
      .forEach((n) => {
        newPositions.add(CtoS(n));
      });
  }
  return newPositions;
}

function part1(input: string[], maxSteps: number) {
  const isValid = (c: Coords) => {
    const v = input[c[0]]?.[c[1]];
    return v === '.' || v === 'S';
  };

  let start: Coords = [-1, -1];
  for (let x = 0; x < input.length; x++) {
    const y = input[x].indexOf('S');
    if (y > -1) {
      start = [x, y];
      break;
    }
  }

  let positions: Set<string> = new Set();
  positions.add(CtoS(start));
  let step = 0;
  while (step < maxSteps) {
    positions = doStep(positions, isValid);
    step++;
  }

  log(`p1 ${positions.size}`);
}

function part2(input: string[]) {
  // p2 idea: since the whole row and line S is on is dots, it must be approximated by quadratic
  // p2 observation: fully filled-out (sub) map will just oscilate between 2 states
  // p2 observation: weird step number! 26501365 = 202300 * map.length + map.length/2
  // reached(steps) grows quadraticly, with len = map.length we need to find reached(offset + i * len), offset is 65 in our case, i is integer
  // we need to get to first 3 i's, then figure out the polynomial
  // reached(steps) in my case as a fnc of i: i=0: 3703, i=1: 32957, i=2: 91379
  // originally plugged this into https://www.dcode.fr/newton-interpolating-polynomial :shrug:
  // wolfram alpha is also a good friend here: https://www.wolframalpha.com/input?i=quadratic+fit+calculator&assumption=%7B%22F%22%2C+%22QuadraticFitCalculator%22%2C+%22data3x%22%7D+-%3E%22%7B0%2C+1%2C+2%7D%22&assumption=%7B%22F%22%2C+%22QuadraticFitCalculator%22%2C+%22data3y%22%7D+-%3E%22%7B3703%2C+32957%2C+91379%7D%22
  // later figured out we can use day9 and made the solution return actual result

  // taken from day9
  const diffs = (row: number[]) => row.map((v, i) => v - row[i - 1]).slice(1);

  const findCoef = (arr: number[][]) =>
    arr.map((step) => {
      while (step.some((v) => v !== 0)) {
        step = diffs(step);
        arr.push(step);
      }
      return arr.map((v) => v[0]);
    });

  const isValid = (c: Coords) => {
    const m = input.length;
    const mod = (n: number) => ((n % m) + m) % m;

    const v = input[mod(c[0])]?.[mod(c[1])];
    return v === '.' || v === 'S';
  };

  let start: Coords = [-1, -1];
  for (let x = 0; x < input.length; x++) {
    const y = input[x].indexOf('S');
    if (y > -1) {
      start = [x, y];
      break;
    }
  }

  let positions: Set<string> = new Set();
  positions.add(CtoS(start));

  let vals = [];

  for (let i = 1; i <= 131 * 2 + 65; i++) {
    positions = doStep(positions, isValid);
    const posCnt = positions.size;
    if (i % 131 == 65) {
      vals.push(posCnt);
    }
  }

  const ks = findCoef([vals])[0];

  log({ 'polynom coeficients ': ks });

  const steps = (26501365 - 65) / 131; // 202300, map.length = 131

  log(`p2: ${ks[0] + ks[1] * steps + (steps * (steps - 1) * ks[2]) / 2}`);
}

// part1(test_input, 6);
// part1(puzzle_input, 64);
part2(puzzle_input);
