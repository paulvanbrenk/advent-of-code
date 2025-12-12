import { readFileSync } from 'fs';
import { dirname, join } from 'path';

/**
 * Reads the input file for the current day
 * Automatically determines the year and day based on the caller's file path
 */
export function readInput(callerPath: string): string {
  // Extract year and day from the caller's path
  // Expected format: .../src/YEAR/dayN.ts
  const match = callerPath.match(/src\/(\d{4})\/day(\d+)\.ts$/);

  if (!match) {
    throw new Error(`Could not determine year/day from path: ${callerPath}`);
  }

  const [, , day] = match;
  const inputPath = join(dirname(callerPath), `input${day}.txt`);

  try {
    return readFileSync(inputPath, 'utf-8').trim();
  } catch (err) {
    throw new Error(
      `Could not read input file: ${inputPath}. Make sure to run 'npm run setup' first.`,
      { cause: err },
    );
  }
}

/**
 * Reads a specific input file by year and day
 */
export function readInputByDay(year: number, day: number): string {
  const inputPath = join(__dirname, `../../../src/${year}/input${day}.txt`);

  try {
    return readFileSync(inputPath, 'utf-8').trim();
  } catch (err) {
    throw new Error(`Could not read input file for ${year} day ${day}`, {
      cause: err,
    });
  }
}

/**
 * Splits input into lines
 */
export function lines(input: string, separator = '\n'): string[] {
  return input.split(separator);
}

/**
 * Splits input into lines and applies a mapping function
 */
export function mapLines<T>(
  input: string,
  mapper: (line: string, index: number) => T,
): T[] {
  return lines(input).map(mapper);
}

/**
 * Splits input into groups separated by blank lines
 */
export function groups(input: string): string[] {
  return input.split('\n\n');
}

/**
 * Splits input into groups separated by blank lines, where each group is an array of lines
 */
export function groupLines(input: string): string[][] {
  return groups(input).map((group) => lines(group));
}

/**
 * Parses input as a 2D character grid
 */
export function charGrid(input: string): string[][] {
  return lines(input).map((line) => line.split(''));
}

/**
 * Parses input as a 2D grid with a custom cell parser
 */
export function grid<T>(input: string, cellParser: (char: string) => T): T[][] {
  return lines(input).map((line) => line.split('').map(cellParser));
}

/**
 * Parses input as a 2D number grid (expects single-digit numbers)
 */
export function numberGrid(input: string): number[][] {
  return grid(input, (char) => Number(char));
}

/**
 * Splits input by a delimiter and converts to numbers
 */
export function numbers(
  input: string,
  delimiter: string | RegExp = /\s+/,
): number[] {
  return input.split(delimiter).map(Number);
}

/**
 * Extracts all integers from a string (including negative numbers)
 */
export function extractIntegers(input: string): number[] {
  const matches = input.match(/-?\d+/g);
  return matches ? matches.map(Number) : [];
}

/**
 * Extracts all integers from each line
 */
export function lineIntegers(input: string): number[][] {
  return lines(input).map(extractIntegers);
}

/**
 * Helper to get dimensions of a grid
 */
export function gridDimensions(grid: unknown[][]): {
  rows: number;
  cols: number;
} {
  return {
    rows: grid.length,
    cols: grid[0]?.length ?? 0,
  };
}

/**
 * Helper to find a character in a grid
 * Returns [row, col] or null if not found
 */
export function findInGrid(
  grid: string[][],
  target: string,
): [number, number] | null {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === target) {
        return [i, j];
      }
    }
  }
  return null;
}

/**
 * Helper to find all occurrences of a character in a grid
 * Returns array of [row, col] positions
 */
export function findAllInGrid(
  grid: string[][],
  target: string,
): [number, number][] {
  const positions: [number, number][] = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === target) {
        positions.push([i, j]);
      }
    }
  }
  return positions;
}

/**
 * Helper to print a grid (useful for debugging)
 */
export function printGrid(grid: unknown[][]): void {
  for (const row of grid) {
    console.log(row.join(''));
  }
}

/**
 * Direction offsets for 4-way (cardinal) neighbors: up, right, down, left
 */
export const DIRS_4 = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
] as const;

/**
 * Direction offsets for 8-way neighbors (including diagonals)
 */
export const DIRS_8 = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
] as const;

/**
 * Executes a function for each neighbor of a grid cell
 * @param row - Current row position
 * @param col - Current column position
 * @param fn - Callback receiving neighbor row, col, and direction index
 * @param dirs - Direction offsets to use (default: DIRS_8 for 8-way)
 */
export function forEachNeighbor(
  row: number,
  col: number,
  fn: (nrow: number, ncol: number, dirIndex: number) => void,
  dirs: readonly (readonly [number, number])[] = DIRS_8,
): void {
  for (let i = 0; i < dirs.length; i++) {
    const [dr, dc] = dirs[i];
    fn(row + dr, col + dc, i);
  }
}

/**
 * Executes a function for each valid neighbor within grid bounds
 * @param grid - The grid (used to check bounds)
 * @param row - Current row position
 * @param col - Current column position
 * @param fn - Callback receiving neighbor row, col, cell value, and direction index
 * @param dirs - Direction offsets to use (default: DIRS_8 for 8-way)
 */
export function forEachGridNeighbor<T>(
  grid: T[][],
  row: number,
  col: number,
  fn: (nrow: number, ncol: number, value: T, dirIndex: number) => void,
  dirs: readonly (readonly [number, number])[] = DIRS_8,
): void {
  for (let i = 0; i < dirs.length; i++) {
    const [dr, dc] = dirs[i];
    const nrow = row + dr;
    const ncol = col + dc;
    if (
      nrow >= 0 &&
      nrow < grid.length &&
      ncol >= 0 &&
      ncol < grid[nrow].length
    ) {
      fn(nrow, ncol, grid[nrow][ncol], i);
    }
  }
}

/**
 * Returns an array of valid neighbor positions within grid bounds
 */
export function getNeighbors<T>(
  grid: T[][],
  row: number,
  col: number,
  dirs: readonly (readonly [number, number])[] = DIRS_8,
): { row: number; col: number; value: T }[] {
  const neighbors: { row: number; col: number; value: T }[] = [];
  forEachGridNeighbor(
    grid,
    row,
    col,
    (nrow, ncol, value) => {
      neighbors.push({ row: nrow, col: ncol, value });
    },
    dirs,
  );
  return neighbors;
}
