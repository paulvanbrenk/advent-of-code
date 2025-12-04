// Advent of Code 2025 - Day 4
import { readFile } from 'fs/promises';
import { join } from 'path';
import { charGrid } from '../utils/input';

async function readInput(filename: string): Promise<string> {
  // Note: tsx provides __dirname even in ES modules
  return (await readFile(join(__dirname, filename), 'utf-8')).trim();
}

function countAdj(grid: string[][], x: number, y: number) {
  let cnt = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const item = grid[x + i]?.[y + j];
      cnt += item === '@' ? 1 : 0;
    }
  }
  return cnt - 1;
}

function updAdj(grid: (number | undefined)[][], x: number, y: number) {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const item = grid[x + i]?.[y + j];
      if (item) {
        grid[x + i][y + j] = item - 1;
      }
    }
  }
}

async function solvePart1(input: string): Promise<string | number> {
  const grid = charGrid(input);

  const clone: number[][] = [];

  for (let x = 0; x < grid.length; x++) {
    const row = grid[x]!;
    clone[x] = [];
    for (let y = 0; y < row.length; y++) {
      if (grid[x][y] === '@') {
        const cnt = countAdj(grid, x, y);
        clone[x][y] = cnt;
      }
    }
  }

  let cnt = 0;
  for (let row of clone) {
    for (let cell of row) {
      if (cell != null && cell < 4) cnt++;
    }
  }

  return cnt;
}

async function solvePart2(input: string): Promise<string | number> {
  const grid = charGrid(input);

  const clone: (number | undefined)[][] = [];

  for (let x = 0; x < grid.length; x++) {
    const row = grid[x]!;
    clone[x] = [];
    for (let y = 0; y < row.length; y++) {
      if (grid[x][y] === '@') {
        const cnt = countAdj(grid, x, y);
        clone[x][y] = cnt;
      }
    }
  }

  let cnt = 0;
  let cntChange = false;
  while (cnt == 0 || cntChange) {
    cntChange = false;
    for (let x = 0; x < clone.length; x++) {
      const row = clone[x];
      for (let y = 0; y < row.length; y++) {
        const cell = row[y];
        if (cell != null && cell < 4) {
          row[y] = undefined;
          updAdj(clone, x, y);
          cntChange = true;
          cnt++;
        }
      }
    }
  }

  return cnt;
}

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const part = args.includes('--part2') ? 2 : 1;
  const useExample = args.includes('--example');

  const inputFile = useExample ? 'example4.txt' : 'input4.txt';
  const input = await readInput(inputFile);

  if (part === 1) {
    console.log('Part 1:', await solvePart1(input));
  } else {
    console.log('Part 2:', await solvePart2(input));
  }
}

main();
