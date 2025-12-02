// Advent of Code 2025 - Day 1
import { readFile } from 'fs/promises';
import { join } from 'path';
import { lines } from '../utils/input';

async function readInput(filename: string): Promise<string> {
  // Note: tsx provides __dirname even in ES modules
  return (await readFile(join(__dirname, filename), 'utf-8')).trim();
}

async function solvePart1(input: string): Promise<string | number> {
  // Parse input - examples:
  const inputLines = lines(input);

  // start at 50
  let position = 50;
  let output = 0;

  for (let line of inputLines) {
    const mod = line[0] === 'L' ? -1 : 1;
    const rotation = Number(line.slice(1));

    position = (position + mod * rotation) % 100;

    if (position === 0) {
      output++;
    }
  }

  return output;
}

async function solvePart2(input: string): Promise<string | number> {
  // Parse input - examples:
  const inputLines = lines(input);

  // start at 50
  let rotation = 50;
  let output = 0;

  for (const line of inputLines) {
    const num = (line[0] === 'L' ? -1 : 1) * Number(line.slice(1));
    output +=
      num > 0
        ? Math.floor((rotation + num) / 100) - Math.floor(rotation / 100)
        : Math.floor((rotation - 1) / 100) -
          Math.floor((rotation - 1 + num) / 100);
    rotation = (rotation + num + 100) % 100;
  }
  return output;
}

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const part = args.includes('--part2') ? 2 : 1;
  const useExample = args.includes('--example');

  const inputFile = useExample ? 'example1.txt' : 'input1.txt';
  const input = await readInput(inputFile);

  if (part === 1) {
    console.log('Part 1:', await solvePart1(input));
  } else {
    console.log('Part 2:', await solvePart2(input));
  }
}

main();
