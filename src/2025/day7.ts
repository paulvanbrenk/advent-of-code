// Advent of Code 2025 - Day 7
import { readFile } from 'fs/promises';
import { join } from 'path';
import { lines, charGrid } from '../utils/input';

async function readInput(filename: string): Promise<string> {
  // Note: tsx provides __dirname even in ES modules
  return (await readFile(join(__dirname, filename), 'utf-8')).trim();
}

async function solvePart1(input: string): Promise<string | number> {
  const inputLines = lines(input);

  let splits = 0;
  let startIdx = inputLines[0].indexOf('S');
  const beams = new Set<number>();
  beams.add(startIdx);

  for (let l of inputLines) {
    for (let i = 0; i < l.length; i++) {
      const ch = l[i];
      if (ch === '^') {
        if (beams.has(i)) {
          splits++;
          beams.delete(i);
          beams.add(i - 1);
          beams.add(i + 1);
        }
      }
    }
  }

  return splits;
}

async function solvePart2(input: string): Promise<string | number> {
  const inputLines = lines(input);

  let timeLines = 1;
  let startIdx = inputLines[0].indexOf('S');
  const beams = new Set<number>();
  beams.add(startIdx);

  for (let l of inputLines) {
    for (let i = 0; i < l.length; i++) {
      const ch = l[i];
      if (ch === '^') {
        if (beams.has(i)) {
          timeLines *= 2;
          beams.delete(i);
          beams.add(i - 1);
          beams.add(i + 1);
        }
      }
    }
  }

  return timeLines;
}

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const part = args.includes('--part2') ? 2 : 1;
  const useExample = true; //args.includes('--example');

  const inputFile = useExample ? 'example7.txt' : 'input7.txt';
  const input = await readInput(inputFile);

  if (part === 1) {
    console.log('Part 1:', await solvePart1(input));
  } else {
    console.log('Part 2:', await solvePart2(input));
  }
}

main();
