// Advent of Code 2025 - Day 6
import { readFile } from 'fs/promises';
import { join } from 'path';
import { gridDimensions, lines, mapLines } from '../utils/input';

async function readInput(filename: string): Promise<string> {
  `nm `;
  // Note: tsx provides __dirname even in ES modules
  return (await readFile(join(__dirname, filename), 'utf-8')).trim();
}

async function solvePart1(input: string): Promise<string | number> {
  // grid is collumn based last entry is operation
  const grid = mapLines(input, (l) => l.trim().split(/\s+/));
  const { rows, cols } = gridDimensions(grid);

  let output = 0n;

  for (let col = 0; col < cols; col++) {
    const op = grid[rows - 1][col].trim();
    let cur = op === '+' ? 0n : 1n;
    for (let r = 0; r < rows - 1; r++) {
      const val = BigInt(grid[r][col]);

      cur = op === '+' ? cur + val : cur * val;
    }
    output += cur;
  }

  return output.toString();
}

async function solvePart2(input: string): Promise<string | number> {
  // op is always at the first idx of the digits

  const ls = lines(input);
  const rows = ls.length;

  let output = 0n;
  let sum = 0n;
  let op: string | undefined;

  let cols = 0;
  for (let row of ls) {
    cols = Math.max(cols, row.length);
  }

  for (let i = 0; i < cols; i++) {
    // final row has operation, new operation means new sum
    if (ls[rows - 1][i] === '+' || ls[rows - 1][i] === '*') {
      op = ls[rows - 1][i];
      output += sum;
      sum = op === '*' ? 1n : 0n;
    }

    const cur: string[] = [];

    for (let j = 0; j < rows - 1; j++) {
      cur.push(ls[j][i]);
    }

    const val = BigInt(cur.join(''));
    if (val === 0n) {
      continue;
    }

    sum = op === '*' ? sum * val : sum + val;
  }

  // add final sum
  output += sum;

  return output.toString();
}

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const part = args.includes('--part2') ? 2 : 1;
  const useExample = args.includes('--example');

  const inputFile = useExample ? 'example6.txt' : 'input6.txt';
  const input = await readInput(inputFile);

  if (part === 1) {
    console.log('Part 1:', await solvePart1(input));
  } else {
    console.log('Part 2:', await solvePart2(input));
  }
}

main();
