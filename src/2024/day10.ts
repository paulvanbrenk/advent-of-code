import { input } from './input';

const myGrid = input.split('\n').map((r) => r.split('').map(Number));

function part1(grid: number[][], cntPeaks: boolean = true) {
  const dirs: Array<[number, number]> = [
    [0, 1],
    [1, 0],
    [-1, 0],
    [0, -1],
  ];

  function walk(x: number, y: number, peaks: Set<string>) {
    const c = grid[x]?.[y];
    if (c == null) {
      // OOB
      return 0;
    }
    if (c === 9) {
      if (cntPeaks && peaks.has(`${x},${y}`)) {
        return 0;
      }
      peaks.add(`${x},${y}`);
      return 1;
    }

    let cnt = 0;
    for (let [dx, dy] of dirs) {
      const nextChar = grid[x + dx]?.[y + dy];
      if (nextChar === c + 1) {
        cnt += walk(x + dx, y + dy, peaks);
      }
    }
    return cnt;
  }

  let score = 0;

  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    for (let j = 0; j < row.length; j++) {
      const c = row[j];
      if (c === 0) {
        const current = walk(i, j, new Set<string>());
        score += current;
      }
    }
  }

  return score;
}

console.log(`unique peaks ${part1(myGrid)}`);
console.log(`trails ${part1(myGrid, false)}`);
