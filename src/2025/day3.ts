// Advent of Code 2025 - Day 3
import { readFile } from 'fs/promises';
import { join } from 'path';
import { numberGrid } from '../utils/input';

async function readInput(filename: string): Promise<string> {
  // Note: tsx provides __dirname even in ES modules
  return (await readFile(join(__dirname, filename), 'utf-8')).trim();
}

async function doWork(input: string, maxBatteries: number) {
  const numberRows = numberGrid(input);

  let sum = 0n;
  for (let r of numberRows) {
    const result: number[] = [];
    let max = 0;
    let idx = 0;

    while (max < maxBatteries) {
      for (let i = idx; i <= r.length - maxBatteries + max; i++) {
        const maxLeft = result[max] ?? 0;
        const newMax = Math.max(maxLeft, r[i]);
        if (newMax != maxLeft) {
          result[max] = newMax;
          idx = i + 1;
        }
      }
      max++;
    }
    sum += BigInt(result.join(''));
  }

  return sum.toString();
}

async function solvePart1(input: string): Promise<string | number> {
  return await doWork(input, 2);
}

async function solvePart2(input: string): Promise<string | number> {
  return await doWork(input, 12);
}

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const part = args.includes('--part2') ? 2 : 1;
  const useExample = args.includes('--example');

  const inputFile = useExample ? 'example3.txt' : 'input3.txt';
  const input = await readInput(inputFile);

  if (part === 1) {
    console.log('Part 1:', await solvePart1(input));
  } else {
    console.log('Part 2:', await solvePart2(input));
  }
}

main();
