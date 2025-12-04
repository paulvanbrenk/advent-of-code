// Advent of Code 2025 - Day 4
import { readFile } from 'fs/promises';
import { join } from 'path';
import { charGrid, forEachGridNeighbor } from '../utils/input';

async function readInput(filename: string): Promise<string> {
  return (await readFile(join(__dirname, filename), 'utf-8')).trim();
}

function countAdj(grid: string[][], row: number, col: number): number {
  let count = 0;
  forEachGridNeighbor(grid, row, col, (_, __, value) => {
    if (value === '@') count++;
  });
  return count;
}

function decrementAdj(grid: (number | undefined)[][], row: number, col: number): void {
  forEachGridNeighbor(grid, row, col, (nrow, ncol, value) => {
    if (value != null) {
      grid[nrow][ncol] = value - 1;
    }
  });
}

function buildAdjacencyGrid(grid: string[][]): (number | undefined)[][] {
  return grid.map((row, r) =>
    row.map((cell, c) => (cell === '@' ? countAdj(grid, r, c) : undefined))
  );
}

async function solvePart1(input: string): Promise<string | number> {
  const grid = charGrid(input);
  const adjacency = buildAdjacencyGrid(grid);

  let unstableCount = 0;
  for (const row of adjacency) {
    for (const cell of row) {
      if (cell != null && cell < 4) unstableCount++;
    }
  }

  return unstableCount;
}

async function solvePart2(input: string): Promise<string | number> {
  const grid = charGrid(input);
  const adjacency = buildAdjacencyGrid(grid);

  let removedCount = 0;
  let changed: boolean;

  do {
    changed = false;
    for (let row = 0; row < adjacency.length; row++) {
      for (let col = 0; col < adjacency[row].length; col++) {
        const cell = adjacency[row][col];
        if (cell != null && cell < 4) {
          adjacency[row][col] = undefined;
          decrementAdj(adjacency, row, col);
          changed = true;
          removedCount++;
        }
      }
    }
  } while (changed);

  return removedCount;
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
