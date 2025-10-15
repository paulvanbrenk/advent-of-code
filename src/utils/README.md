# Advent of Code Helper Functions

This library provides utility functions to simplify common Advent of Code input parsing patterns.

## Input Reading

### `readInput(callerPath: string): string`

Reads the input file for the current day. Automatically determines the year and day based on the caller's file path.

```typescript
import { readInput } from '../utils/input';

const input = readInput(__filename);
```

### `readInputByDay(year: number, day: number): string`

Reads a specific input file by year and day.

```typescript
const input = readInputByDay(2023, 5);
```

## Line Parsing

### `lines(input: string): string[]`

Splits input into an array of lines.

```typescript
const inputLines = lines(input);
// ["line1", "line2", "line3"]
```

### `mapLines<T>(input: string, mapper: (line: string, index: number) => T): T[]`

Splits input into lines and applies a mapping function to each line.

```typescript
const numbers = mapLines(input, line => parseInt(line));
```

## Group Parsing

### `groups(input: string): string[]`

Splits input into groups separated by blank lines.

```typescript
const groupsArray = groups(input);
// ["group1line1\ngroup1line2", "group2line1\ngroup2line2"]
```

### `groupLines(input: string): string[][]`

Splits input into groups, where each group is an array of lines.

```typescript
const groupsArray = groupLines(input);
// [["group1line1", "group1line2"], ["group2line1", "group2line2"]]
```

## Grid Parsing

### `charGrid(input: string): string[][]`

Parses input as a 2D character grid.

```typescript
const grid = charGrid(input);
// [["a", "b", "c"], ["d", "e", "f"]]
```

### `grid<T>(input: string, cellParser: (char: string) => T): T[][]`

Parses input as a 2D grid with a custom cell parser.

```typescript
const grid = grid(input, char => char === '#' ? 1 : 0);
```

### `numberGrid(input: string): number[][]`

Parses input as a 2D grid of single-digit numbers.

```typescript
const grid = numberGrid(input);
// [[1, 2, 3], [4, 5, 6]]
```

### `gridDimensions(grid: unknown[][]): { rows: number; cols: number }`

Returns the dimensions of a grid.

```typescript
const { rows, cols } = gridDimensions(grid);
```

## Number Parsing

### `numbers(input: string, delimiter?: string | RegExp): number[]`

Splits input by a delimiter and converts to numbers.

```typescript
const nums = numbers('1 2 3 4 5');        // [1, 2, 3, 4, 5]
const nums = numbers('1,2,3,4,5', ',');   // [1, 2, 3, 4, 5]
```

### `extractIntegers(input: string): number[]`

Extracts all integers from a string (including negative numbers).

```typescript
const nums = extractIntegers('x=10, y=-5, z=100');
// [10, -5, 100]
```

### `lineIntegers(input: string): number[][]`

Extracts all integers from each line.

```typescript
const nums = lineIntegers(input);
// [[10, 20], [30, 40], [50, 60]]
```

## Grid Search Functions

### `findInGrid(grid: string[][], target: string): [number, number] | null`

Finds the first occurrence of a character in a grid. Returns `[row, col]` or `null`.

```typescript
const position = findInGrid(grid, 'S');
// [2, 5] or null
```

### `findAllInGrid(grid: string[][], target: string): [number, number][]`

Finds all occurrences of a character in a grid.

```typescript
const positions = findAllInGrid(grid, 'a');
// [[0, 2], [1, 5], [3, 1]]
```

## Utility Functions

### `printGrid(grid: unknown[][]): void`

Prints a grid to console (useful for debugging).

```typescript
printGrid(grid);
// ###
// #.#
// ###
```

## Example Usage

```typescript
// Advent of Code 2023 - Day 8
import { readInput, lines, extractIntegers } from '../utils/input';

const input = readInput(__filename);

function solvePart1(input: string): number {
  const inputLines = lines(input);

  for (const line of inputLines) {
    const nums = extractIntegers(line);
    // Process numbers...
  }

  return 0;
}

function solvePart2(input: string): number {
  const grid = charGrid(input);
  const start = findInGrid(grid, 'S');

  if (!start) {
    throw new Error('Start position not found');
  }

  // Process grid...
  return 0;
}

console.log('Part 1:', solvePart1(input));
console.log('Part 2:', solvePart2(input));
```
