import { Heap } from "heap-js";

const test_input = `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`
  .split("\n")
  .map((c) => c.split("").map(Number));

const test_input2 = `111111111111
999999999991
999999999991
999999999991
999999999991`
  .split("\n")
  .map((c) => c.split("").map(Number));

const puzzle_input = `<get from aoc website>`
  .split("\n")
  .map((c) => c.split("").map(Number));

type Coords = [row: number, col: number];

type Point = [loc: Coords, dir: Coords, cnt: number, heatLoss: number];

const directions: readonly Coords[] = [
  [-1, 0],
  [0, -1],
  [1, 0],
  [0, 1],
];

function log(u: unknown) {
  console.log(JSON.stringify(u, undefined, 2));
}

function getKey(p: Point): number {
  const key =
    (p[0][0] << 24) |
    (p[0][1] << 16) |
    ((p[1][0] & 3) << 14) |
    ((p[1][1] & 3) << 12) |
    p[2];
  return key;
}

function sameDir(l: Coords, r: Coords) {
  return l[0] === r[0] && l[1] === r[1];
}

function isStart(p: Coords, d: Coords) {
  return p[0] === 0 && p[1] === 0 && d[0] === 0 && d[1] === 0;
}

function part1(input: readonly number[][], minStep = 0, maxStep = 3) {
  const visited: Set<number> = new Set();

  const start: Coords = [0, 0];
  const target: Coords = [input.length - 1, input[0].length - 1];

  const stack = new Heap<Point>((l, r) => l[3] - r[3]);
  stack.add([start, [0, 0], 0, 0]);
  while (stack.length > 0) {
    const currentMin = stack.pop();
    if (currentMin == null) {
      throw new Error("null entry");
    }

    const key = getKey(currentMin);
    if (visited.has(key)) {
      continue;
    }

    visited.add(key);

    if (currentMin == null) {
      throw new Error("null in stack");
    }

    // find next directions
    for (let idx = 0; idx < 4; idx++) {
      const d = directions[idx];
      const [prev, dir, cnt, heatLoss] = currentMin;
      const nextPos: Coords = [prev[0] + d[0], prev[1] + d[1]];
      const newHeat = input[nextPos[0]]?.[nextPos[1]];

      // out of bounds check
      if (newHeat == null) {
        continue;
      }

      const nextCnt = sameDir(dir, d) ? cnt + 1 : 1;

      // at the start
      if (!isStart(prev, dir)) {
        // backwards
        if (dir[0] === -1 * d[0] && dir[1] === -1 * d[1]) {
          continue;
        }

        // min steps, only for non-start
        if (cnt < minStep && !sameDir(dir, d)) {
          continue;
        }

        // max Steps
        if (cnt >= maxStep && sameDir(dir, d)) {
          continue;
        }

        if (
          nextPos[0] === target[0] &&
          nextPos[1] === target[1] &&
          nextCnt >= minStep &&
          nextCnt <= maxStep
        ) {
          log(`heatloss at end ${heatLoss + newHeat}`);
          return;
        }
      }

      const newCandidate: Point = [nextPos, d, nextCnt, heatLoss + newHeat];

      const key = getKey(newCandidate);
      if (!visited.has(key)) {
        stack.add(newCandidate);
      }
    }
  }
  log("no result");
}

part1(test_input); // 102

part1(test_input, 4, 10); // 94
part1(test_input2, 4, 10); // 71

part1(puzzle_input); // 953
part1(puzzle_input, 4, 10); // 1180
