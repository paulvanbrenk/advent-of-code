import { input } from './input';

const myGrid: string[][] = input.split('\n').map((r) => r.split(''));

type Point = [number, number];

const dirs: Map<string, Point> = new Map([
  ['E', [0, 1]],
  ['S', [1, 0]],
  ['N', [-1, 0]],
  ['W', [0, -1]],
]);

let start: Point = [-1, -1];

for (let i = 0; i < myGrid.length; i++) {
  const row = myGrid[i];
  for (let j = 0; j < row.length; j++) {
    const c = row[j];

    if (c === 'S') {
      start = [i, j];
      myGrid[i][j] = '.';
      break;
    }
  }
}

type Grid = ReadonlyArray<ReadonlyArray<string>>;

function doWork(grid: Grid, start: Point, maxRadius: number) {
  const hash = (x: number, y: number) => `${x},${y}`;
  const map: Map<string, number> = new Map();

  const cheats: Map<number, number> = new Map();
  const uniqueCheats: Set<string> = new Set();

  let current = start;
  let step = 0;
  while (true) {
    const [x, y] = current;
    const key = hash(x, y);
    if (map.has(key)) {
      console.log('no');
      break;
    }
    map.set(key, step);

    for (let [_, [dx, dy]] of dirs.entries()) {
      const next: Point = [current[0] + dx, current[1] + dy];

      if (
        (myGrid[next[0]][next[1]] === '.' ||
          myGrid[next[0]][next[1]] === 'E') &&
        !map.has(hash(current[0] + dx, current[1] + dy))
      ) {
        current = next;
        step++;
        break;
      }
    }
    // could I have gotten here faster

    for (let dx = -1 * maxRadius; dx <= maxRadius; dx++) {
      for (let dy = -1 * maxRadius; dy <= maxRadius; dy++) {
        const radius = Math.abs(dx) + Math.abs(dy);
        if (radius > maxRadius) {
          continue;
        }

        const start = [current[0] + dx, current[1] + dy];
        const tile2 = grid[start[0]]?.[start[1]];

        if (tile2 === '.') {
          // valid cheat
          const startKey = hash(start[0], start[1]);
          const stepCnt = map.get(startKey);
          if (stepCnt != null) {
            const diff = step - stepCnt - radius;
            if (diff < 2) {
              continue;
            }
            const u = JSON.stringify({ start, end: current });
            if (!uniqueCheats.has(u)) {
              uniqueCheats.add(u);
            }

            cheats.set(diff, (cheats.get(diff) ?? 0) + 1);
          }
        }
      }
    }

    const c = myGrid[current[0]]?.[current[1]];
    if (c === 'E') {
      break;
    }
  }

  let sum = 0;
  const sorted = Array.from(cheats.entries()).sort((x, y) => x[0] - y[0]);
  for (let [cheat, cnt] of sorted) {
    if (cheat >= 100) {
      sum += cnt;
    }
    console.log(`${cnt} saves ${cheat}`);
  }
  console.log(sum);
}

console.log(doWork(myGrid, start, 2));
console.log(doWork(myGrid, start, 20));
