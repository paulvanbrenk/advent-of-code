// Advent of Code 2025 - Day 2
import { readFile } from 'fs/promises';
import { join } from 'path';
import { lines } from '../utils/input';

async function readInput(filename: string): Promise<string> {
  // Note: tsx provides __dirname even in ES modules
  return (await readFile(join(__dirname, filename), 'utf-8')).trim();
}

async function solvePart1(input: string): Promise<string | number> {
  // Parse input - examples:
  const inputLines = lines(input, ',');

  let output = 0n;

  for (const line of inputLines) {
    let [start, end] = line.split('-').map(Number);
    for (let i = start; i <= end; i++) {
      const str = i.toString();
      if (str.length % 2 !== 0) {
        continue;
      }

      const half = str.length / 2;

      let addition = i;

      for (let j = 0; j < str.length / 2; j++) {
        if (str[j] !== str[half + j]) {
          addition = 0;
          break;
        }
      }
      output = output + BigInt(addition);
    }
  }
  return output.toString();
}

async function solvePart2(input: string): Promise<string | number> {
  // Parse input - examples:
  const inputLines = lines(input, ',');

  let output = 0n;

  for (const line of inputLines) {
    let [start, end] = line.split('-').map(Number);
    for (let i = start; i <= end; i++) {
      const str = i.toString();

      let split = 2;

      while (Math.floor(str.length / split) >= 1) {
        if (str.length % split !== 0) {
          split += 1;
          continue;
        }

        const partLength = str.length / split;
        const template = str.slice(0, partLength).repeat(split);
        if (template === str) {
          output = output + BigInt(i);
          break;
        }
        split += 1;
      }
    }
  }
  return output.toString();
}

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const part = args.includes('--part2') ? 2 : 1;
  const useExample = args.includes('--example');

  const inputFile = useExample ? 'example2.txt' : 'input2.txt';
  const input = await readInput(inputFile);

  if (part === 1) {
    console.log('Part 1:', await solvePart1(input));
  } else {
    console.log('Part 2:', await solvePart2(input));
  }
}

main();
