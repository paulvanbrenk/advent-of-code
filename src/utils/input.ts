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

  const [, year, day] = match;
  const inputPath = join(dirname(callerPath), `input${day}.txt`);

  try {
    return readFileSync(inputPath, 'utf-8').trim();
  } catch (err) {
    throw new Error(
      `Could not read input file: ${inputPath}. Make sure to run 'npm run setup' first.`,
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
    throw new Error(`Could not read input file for ${year} day ${day}`);
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
