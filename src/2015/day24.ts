// Advent of Code 2015 - Day 24
import { readFile } from 'fs/promises';
import { join } from 'path';
import { lines, charGrid } from '../utils/input';

async function readInput(filename: string): Promise<string> {
  // Note: tsx provides __dirname even in ES modules
  return (await readFile(join(__dirname, filename), 'utf-8')).trim();
}

async function solvePart1(input: string): Promise<string | number> {
  // Parse input - examples:
  // const inputLines = lines(input);
  // const grid = charGrid(input);

  // TODO: Implement Part 1
  return 0;
}

async function solvePart2(input: string): Promise<string | number> {
  // TODO: Implement Part 2
  return 0;
}

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const part = args.includes('--part2') ? 2 : 1;
  const useExample = args.includes('--example');

  const inputFile = useExample ? 'example24.txt' : 'input24.txt';
  const input = await readInput(inputFile);

  if (part === 1) {
    console.log('Part 1:', await solvePart1(input));
  } else {
    console.log('Part 2:', await solvePart2(input));
  }
}

main();
