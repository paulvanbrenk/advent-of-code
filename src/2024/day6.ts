import { input } from './input';

const inputGrid = input.split('\n').map((r) => r.split(''));

function findStart(grid: string[][]) {
  for (let i = 0; i < grid[0].length; i++) {
    const row = grid[i];
    for (let j = 0; j < row.length; j++) {
      const c = row[j];
      if (c === '^') {
        return { x: i, y: j };
      }
    }
  }

  throw new Error('Failed to find start');
}

function getChar(grid: string[][], x: number, y: number) {
  return grid[x]?.[y];
}

const direction = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

function part1(originalGrid: string[][]) {
  const cands: [number, number][] = [];
  const grid = structuredClone(originalGrid);

  let result = 1;

  let { x, y } = findStart(grid);
  let dir = 0;
  let c = getChar(grid, x, y);
  while (c != null) {
    let next = [x + direction[dir][0], y + direction[dir][1]];
    const nextChar = getChar(grid, next[0], next[1]);
    if (nextChar === '#') {
      // rotate right
      dir = (dir + 1) % 4;
      continue;
    }

    if (c === '.') {
      result++;
      grid[x][y] = 'X';
      cands.push([x, y]);
    }

    x = next[0];
    y = next[1];
    c = nextChar;
  }

  return { result, cands };
}

function part2(originalGrid: string[][], cands: [number, number][]) {
  let result = 0;
  const start = findStart(originalGrid);
  const grid = structuredClone(originalGrid);

  // try each candidate as an obstacle
  for (let obs of cands) {
    const visited = new Set<string>();
    let { x, y } = start;
    let dir = 0;
    let c = getChar(grid, x, y);
    while (c != null) {
      let next = [x + direction[dir][0], y + direction[dir][1]];
      const nextChar = getChar(grid, next[0], next[1]);
      if (nextChar === '#' || (next[0] === obs[0] && next[1] === obs[1])) {
        // rotate right
        dir = (dir + 1) % 4;
        continue;
      }

      if (c === '.') {
        const key = `${x},${y},${dir}`;
        if (visited.has(key)) {
          result++;
          break;
        }
        visited.add(key);
      }

      x = next[0];
      y = next[1];
      c = nextChar;
    }
  }

  return result;
}

const { result: result1, cands } = part1(inputGrid);

console.log(result1);

console.log(part2(inputGrid, cands));
