import { input } from './input';

const myCodes = input.split('\n');

type Point = [number, number];

const dirs: Map<string, Point> = new Map([
  ['>', [0, 1]],
  ['v', [1, 0]],
  ['^', [-1, 0]],
  ['<', [0, -1]],
]);

const NumKeypad: Map<string, Point> = new Map([
  ['7', [0, 0]],
  ['8', [0, 1]],
  ['9', [0, 2]],
  ['4', [1, 0]],
  ['5', [1, 1]],
  ['6', [1, 2]],
  ['1', [2, 0]],
  ['2', [2, 1]],
  ['3', [2, 2]],
  ['X', [3, 0]],
  ['0', [3, 1]],
  ['A', [3, 2]],
]);

const DirKeyPad: Map<string, Point> = new Map([
  ['X', [0, 0]],
  ['^', [0, 1]],
  ['A', [0, 2]],
  ['<', [1, 0]],
  ['v', [1, 1]],
  ['>', [1, 2]],
]);

const cache = new Map<string, number>();

function getPaths(keypad: Map<string, Point>, start: string, end: string) {
  const startPos = keypad.get(start);
  const endPos = keypad.get(end);
  const blankPos = keypad.get('X');

  if (startPos == null || endPos == null || blankPos == null) {
    throw new Error('invalid something');
  }

  const validCoords = Array.from(keypad.values());

  const q: [Point, string][] = [[startPos, '']];
  const visited: Map<string, number> = new Map();

  if (start === end) {
    return ['A'];
  }

  let minPath = Number.MAX_VALUE;
  let allPaths: string[] = [];
  while (q.length > 0) {
    const [[x, y], path] = q.pop()!;

    if (x === endPos[0] && y === endPos[1]) {
      allPaths.push(path + 'A');
      minPath = Math.min(minPath, path.length + 1);
    }
    if ((visited.get(`${x},${y}`) ?? Number.MAX_VALUE) < path.length) {
      continue;
    }

    for (let [direction, [dx, dy]] of dirs.entries()) {
      const position: Point = [x + dx, y + dy];

      if (blankPos[0] === position[0] && blankPos[1] === position[1]) {
        continue;
      }

      const button = validCoords.find(
        (c) => c[0] === position[0] && c[1] === position[1],
      );
      if (button != null) {
        const newPath = path + direction;

        if (
          (visited.get(`${position[0]},${position[1]}`) ?? Number.MAX_VALUE) >=
          newPath.length
        ) {
          q.push([position, newPath]);
          visited.set(`${position[0]},${position[1]}`, newPath.length);
        }
      }
    }
  }

  return allPaths.filter((a) => a.length == minPath);
}

function getKeyCnt(
  keypad: Map<string, Point>,
  code: string,
  robot: number,
): number {
  const key = `${code},${robot}`;
  const cacheVal = cache.get(key);
  if (cacheVal != null) {
    return cacheVal;
  }

  let start = 'A';
  let length = 0;
  for (let c of code) {
    const moves = getPaths(keypad, start, c);
    if (robot === 0) {
      length += moves.reduce(
        (min, cur) => Math.min(min, cur.length),
        Number.MAX_VALUE,
      );
    } else {
      let newMin = Number.MAX_VALUE;
      for (let m of moves) {
        const cnt = getKeyCnt(DirKeyPad, m, robot - 1);
        newMin = Math.min(newMin, cnt);
      }
      length += newMin;
    }

    start = c;
  }

  cache.set(key, length);
  return length;
}

function doWork(codes: string[], robots: number = 2) {
  let result = 0;
  for (let c of codes) {
    const mult = Number(c.substring(0, 3));
    const cnt = getKeyCnt(NumKeypad, c, robots);
    result += mult * cnt;
  }
  return result;
}

console.log(doWork(myCodes));
console.log(doWork(myCodes, 25));
