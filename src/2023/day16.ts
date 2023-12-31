function log(u: unknown) {
  console.log(JSON.stringify(u, undefined, 2));
}

const test_input = `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`.split('\n');

const puzzle_input = `<get from aoc website>`.split('\n');

type coords = [row: number, col: number];
function fillGrid(
  grid: readonly string[],
  start: coords,
  direction: coords,
): Set<string> {
  const cache: Map<string, Set<string>> = new Map();
  const loop: Set<string> = new Set();

  return fillGridWorker(grid, start, direction);

  function fillGridWorker(
    grid: readonly string[],
    start: coords,
    direction: coords,
  ): Set<string> {
    const visited: Set<string> = new Set();
    const key = JSON.stringify([start, direction]);
    if (cache.has(key)) {
      return cache.get(key) ?? new Set<string>();
    }

    if (loop.has(key)) {
      return new Set<string>();
    }
    loop.add(key);

    let d = direction;

    let x = start[0] + direction[0];
    let y = start[1] + direction[1];
    let cnt = 0;
    while (
      x >= 0 &&
      y >= 0 &&
      x < grid.length &&
      y < grid[0].length &&
      cnt < 100_000
    ) {
      visited.add(`${x},${y}`);
      const c = grid[x][y];

      if (c === '.') {
        x += d[0];
        y += d[1];
      }
      if (c === '/') {
        d = d[0] === 0 ? [-1 * d[1], 0] : [0, -1 * d[0]];
        x += d[0];
        y += d[1];
      }
      if (c === '\\') {
        d = d[0] === 0 ? [d[1], 0] : [0, d[0]];
        x += d[0];
        y += d[1];
      }
      if (c === '-') {
        if (d[0] === 0) {
          y += d[1];
        } else {
          const top = fillGridWorker(grid, [x, y], [0, 1]);
          top.forEach((v) => visited.add(v));
          const bottom = fillGridWorker(grid, [x, y], [0, -1]);
          bottom.forEach((v) => visited.add(v));
          break;
        }
      }
      if (c === '|') {
        if (d[1] === 0) {
          x += d[0];
        } else {
          const left = fillGridWorker(grid, [x, y], [1, 0]);
          left.forEach((v) => visited.add(v));
          const right = fillGridWorker(grid, [x, y], [-1, 0]);
          right.forEach((v) => visited.add(v));
          break;
        }
      }
    }
    cache.set(key, visited);

    return visited;
  }
}

function part1(input: string[]) {
  const cnt = fillGrid(input, [0, -1], [0, 1]);
  log(cnt.size);
}

function part2(input: string[]) {
  const sources: Array<[coords, coords]> = [];
  // generate input for all sides
  for (let i = 0; i < input.length; i++) {
    sources.push([
      [i, -1],
      [0, 1],
    ]);
    sources.push([
      [i, input.length],
      [0, -1],
    ]);
  }
  for (let i = 0; i < input[0].length; i++) {
    sources.push([
      [-1, i],
      [1, 0],
    ]);
    sources.push([
      [input.length, i],
      [-1, 0],
    ]);
  }

  // map to sums

  const sums = sources.map((s) => fillGrid(input, s[0], s[1]));

  log({ sums: sums.map((s) => s.size) });
  // find max

  const max = sums.reduce((a, c) => Math.max(a, c.size), 0);

  log(max);
}

// part1(puzzle_input);
part2(puzzle_input);
