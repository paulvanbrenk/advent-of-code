import { input } from './input';

const box = 'O';
const robot = '@';
const wall = '#';
const empty = '.';
const boxLeft = '[';
const boxRight = ']';

const lines = input.split('\n');

const myGrid: string[][] = [];
const myWideGrid: string[][] = [];
let myMoves = '';

let i = 0;
for (let l of lines) {
  if (l.startsWith(wall)) {
    myGrid.push(l.split(''));
    myWideGrid.push([]);
    for (let c of l) {
      if (c === robot) {
        myWideGrid[i].push(c);
        myWideGrid[i].push(empty);
      } else if (c === box) {
        myWideGrid[i].push(boxLeft);
        myWideGrid[i].push(boxRight);
      } else {
        myWideGrid[i].push(c);
        myWideGrid[i].push(c);
      }
    }
    i++;
  } else {
    myMoves = myMoves.concat(l);
  }
}

type Point = [number, number];

const directions = new Map<string, Point>([
  ['<', [0, -1]],
  ['v', [1, 0]],
  ['>', [0, 1]],
  ['^', [-1, 0]],
]);

function nextStep(pnt: Point, mv: string): Point {
  const dir = directions.get(mv)!;

  return [pnt[0] + dir[0], pnt[1] + dir[1]];
}

function print(grid: string[][]) {
  for (let r of grid) {
    console.log(r.join(''));
  }
}

function part1(grid: string[][], moves: string) {
  function swap(l: Point, r: Point) {
    const tmp = grid[l[0]][l[1]];
    grid[l[0]][l[1]] = grid[r[0]][r[1]];
    grid[r[0]][r[1]] = tmp;
  }

  function doWork(start: Point, move: string) {
    const next = nextStep(start, move);

    const field = grid[next[0]][next[1]];

    if (field == wall) {
      return false;
    }

    if (field == empty) {
      swap(start, next);
      return true;
    }

    if (doWork(next, move)) {
      swap(start, next);
      return true;
    }
    return false;
  }

  let rp: Point = [-1, -1];

  // find robot
  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    for (let j = 0; j < row.length; j++) {
      const c = row[j];
      if (c === robot) {
        rp = [i, j];
        break;
      }
    }
  }

  for (let c of moves) {
    if (doWork(rp, c)) {
      rp = nextStep(rp, c);
    }
  }
  print(grid);

  let result = 0;
  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    for (let j = 0; j < row.length; j++) {
      const c = row[j];
      if (c === box) {
        result += i * 100 + j;
      }
    }
  }
  return result;
}

function part2(grid: string[][], moves: string) {
  function swap(l: Point, r: Point) {
    const tmp = grid[l[0]][l[1]];
    grid[l[0]][l[1]] = grid[r[0]][r[1]];
    grid[r[0]][r[1]] = tmp;
  }

  function canMove(start: Point, move: string): boolean {
    const next = nextStep(start, move);

    const current = grid[start[0]][start[1]];

    if (current == wall) {
      return false;
    }

    if (current == empty) {
      return true;
    }

    // handle boxes special for vert
    if (move === '^' || move === 'v') {
      if (current === boxLeft) {
        if (canMove(next, move) && canMove([next[0], next[1] + 1], move)) {
          return true;
        }
        return false;
      }
      if (current == boxRight) {
        if (canMove(next, move) && canMove([next[0], next[1] - 1], move)) {
          return true;
        }
        return false;
      }
    }

    if (canMove(next, move)) {
      return true;
    }
    return false;
  }

  function doWork(start: Point, move: string): boolean {
    const next = nextStep(start, move);

    const current = grid[start[0]][start[1]];

    if (current == wall) {
      return false;
    }

    if (current == empty) {
      return true;
    }

    // handle boxes special for vert
    if (move === '^' || move === 'v') {
      if (current === boxLeft) {
        if (doWork(next, move) && doWork([next[0], next[1] + 1], move)) {
          swap(start, next);
          swap([start[0], start[1] + 1], [next[0], next[1] + 1]);

          return true;
        }
        return false;
      }
      if (current == boxRight) {
        if (doWork(next, move) && doWork([next[0], next[1] - 1], move)) {
          swap(start, next);
          swap([start[0], start[1] - 1], [next[0], next[1] - 1]);

          return true;
        }
        return false;
      }
    }

    if (doWork(next, move)) {
      swap(start, next);
      return true;
    }
    return false;
  }

  let rp: Point = [-1, -1];

  // find robot
  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    for (let j = 0; j < row.length; j++) {
      const c = row[j];
      if (c === robot) {
        rp = [i, j];
        break;
      }
    }
  }

  for (let c of moves) {
    // console.log('--------------------------------------------------');
    // console.log(`step ${c}`);
    // print(grid);
    if (canMove(rp, c)) {
      if (!doWork(rp, c)) {
        throw new Error();
      }
      rp = nextStep(rp, c);
    }
    // print(grid);
  }

  let result = 0;
  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    for (let j = 0; j < row.length; j++) {
      const c = row[j];
      if (c === boxLeft) {
        // grid[i][j] = 'X';
        // console.log(JSON.stringify({ i, j }));
        result += i * 100 + j;
      }
    }
  }

  print(grid);

  return result;
}

// console.log(part1(structuredClone(myGrid), myMoves));
console.log(part2(structuredClone(myWideGrid), myMoves));
