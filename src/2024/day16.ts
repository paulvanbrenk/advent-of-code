import { Heap } from 'heap-js';

import { input } from './input';

type Point = [x: number, y: number];

const myGrid = input.split('\n').map((r) => r.split(''));

const dirs: Map<string, Point> = new Map([
  ['E', [0, 1]],
  ['S', [1, 0]],
  ['N', [-1, 0]],
  ['W', [0, -1]],
]);

function print(grid: string[][]) {
  for (let r of grid) {
    console.log(r.join(''));
  }
}

function part1(grid: string[][]) {
  function getField(p: Point) {
    return grid[p[0]][p[1]];
  }
  const start: Point = [grid.length - 2, 1];
  const initialDir = 'E';

  if (getField(start) !== 'S') {
    throw new Error();
  }

  const visited = new Map<string, number>();

  const result = [];

  let minCost = Number.MAX_VALUE;

  const q = new Heap<[Point, string, number, Point[]]>((l, r) => l[2] - r[2]);

  q.push([start, initialDir, 0, []]);
  while (q.length > 0) {
    const [pos, dir, cost, [...path]] = q.pop()!;

    // don't bother if the total is going to be higher
    if (cost > minCost) {
      break;
    }

    const field = getField(pos);
    // reached end
    if (field === 'E') {
      if (cost < minCost) {
        minCost = cost;
      }
      path.push(pos);
      result.push({ path, cost });
      continue;
    }
    // reached wall
    if (field === '#') {
      continue;
    }

    // visited before ignore if last visit was cheaper
    const key = `${pos}@${dir}`;
    if (visited.has(key)) {
      if (visited.get(key)! < cost) {
        continue;
      }
    }
    visited.set(key, cost);
    path.push(pos);

    // next steps

    for (let [c, dxdy] of dirs.entries()) {
      if (
        (dir === 'E' && c === 'W') ||
        (dir === 'W' && c === 'E') ||
        (dir === 'N' && c === 'S') ||
        (dir === 'S' && c === 'N')
      ) {
        // don't backtrack
        continue;
      }

      let nextPos: Point = [0, 0];
      let newCost = 0;

      if (c === dir) {
        nextPos = [pos[0] + dxdy[0], pos[1] + dxdy[1]];
        newCost = cost + 1;
      }

      if (dir === 'E' || dir === 'W') {
        if (c === 'N' || c === 'S') {
          nextPos = [pos[0] + dxdy[0], pos[1] + dxdy[1]];
          newCost = cost + 1001;
        }
      }

      if (dir === 'N' || dir === 'S') {
        if (c === 'E' || c === 'W') {
          nextPos = [pos[0] + dxdy[0], pos[1] + dxdy[1]];
          newCost = cost + 1001;
        }
      }
      if (getField(nextPos) !== '#') {
        q.push([nextPos, c, newCost, path]);
      }
    }
  }

  const spots = new Set<string>();
  for (let route of result) {
    for (let s of route.path) {
      const key = JSON.stringify(s);
      spots.add(key);
    }
  }

  // print(grid);
  return { part1: minCost, part2: spots.size };
}

console.log(part1(structuredClone(myGrid)));
