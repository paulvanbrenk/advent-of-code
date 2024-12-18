import { test, input } from './input';
import { Heap } from 'heap-js';

const myTestWalls = test.split('\n');
const myWalls = input.split('\n');

type Point = [number, number];

const dirs: Map<string, Point> = new Map([
  ['E', [0, 1]],
  ['S', [1, 0]],
  ['N', [-1, 0]],
  ['W', [0, -1]],
]);

function doWork(walls: string[], wallCnt: number, size: number): number {
  function inRange(n: number) {
    return 0 <= n && n <= size;
  }

  const wallSet = new Set(walls.slice(0, wallCnt));

  for (let [entry] of wallSet.entries()) {
    const [x, y] = entry.split(',').map(Number);
  }

  const start: Point = [0, 0];

  const visited = new Map<string, number>();

  const q: Heap<[Point, number]> = new Heap((l, r) => l[1] - r[1]);
  q.add([start, 0]);
  let i = 0;
  let j = 0;
  while (q.length > 0) {
    const [step, score] = q.pop()!;
    i++;

    if (step[0] === size && step[1] === size) {
      return score;
    }

    if ((visited.get(`${step[0]},${step[1]}`) ?? Number.MAX_VALUE) <= score) {
      continue;
    }

    visited.set(`${step[0]},${step[1]}`, score);

    const nextScore = score + 1;
    for (let [_, [dx, dy]] of dirs.entries()) {
      const next: Point = [step[0] + dx, step[1] + dy];

      // make sure we're in the grid
      if (!inRange(next[0]) || !inRange(next[1])) {
        continue;
      }

      const key = `${next[0]},${next[1]}`;

      // found wall
      if (wallSet.has(key)) {
        continue;
      }

      // already visited, prevent backtracking
      if ((visited.get(key) ?? Number.MAX_VALUE) <= nextScore) {
        continue;
      }
      q.add([next, nextScore]);
    }
  }

  return -1;
}

// binary search, using the result from part 1 as a start for the low
function part2(walls: string[], initial: number, size: number) {
  let low = initial;
  let high = walls.length - 1;
  while (low < high) {
    const test = low + Math.floor((high - low) / 2);
    const result = doWork(walls, test, size);

    if (result < 0) {
      // no path
      high = test - 1;
    } else {
      low = test + 1;
    }
  }

  return walls[high];
}

console.log(doWork(myTestWalls, 12, 6));
console.log(doWork(myWalls, 1024, 70));

console.log(part2(myTestWalls, 12, 6));
console.log(part2(myWalls, 0, 70));
