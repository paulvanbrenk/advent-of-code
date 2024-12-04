import { input } from './input';

const wordGrid = input.split('\n');

function part1(grid: string[]) {
  const directions: ReadonlyArray<[number, number]> = [
    [-1, 1],
    [0, 1],
    [1, 1],
    [-1, 0],
    [1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
  ];

  let wordCount = 0;

  const word = 'XMAS';

  function testDir(x: number, y: number, dir: [number, number]) {
    for (let c of word) {
      if (grid[x]?.[y] !== c) {
        return;
      }
      x += dir[0];
      y += dir[1];
    }
    wordCount++;
  }

  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    for (let j = 0; j < row.length; j++) {
      const c = row[j];
      if (c === 'X') {
        for (let d of directions) {
          testDir(i, j, d);
        }
      }
    }
  }
  return wordCount;
}

function part2(grid: string[]) {
  let wordCount = 0;

  const getChar = (a: number, b: number) => grid[a]?.[b];

  function testDirs(x: number, y: number) {
    const first =
      (getChar(x + 1, y + 1) === 'M' && getChar(x - 1, y - 1) === 'S') ||
      (getChar(x - 1, y - 1) === 'M' && getChar(x + 1, y + 1) === 'S');
    const second =
      (getChar(x + 1, y - 1) === 'M' && getChar(x - 1, y + 1) === 'S') ||
      (getChar(x - 1, y + 1) === 'M' && getChar(x + 1, y - 1) === 'S');

    if (first && second) {
      wordCount++;
    }
  }

  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    for (let j = 0; j < row.length; j++) {
      const c = row[j];
      if (c === 'A') {
        testDirs(i, j);
      }
    }
  }

  return wordCount;
}

console.log(part1(wordGrid));
console.log(part2(wordGrid));
