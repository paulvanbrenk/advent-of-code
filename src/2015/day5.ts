// Advent of Code 2015 - Day 5
import { readFile } from 'fs/promises';
import { join } from 'path';
import { lines } from '../utils/input';

async function readInput(filename: string): Promise<string> {
  return (await readFile(join(__dirname, filename), 'utf-8')).trim();
}

function isNicePart1(s: string): boolean {
  const hasThreeVowels = (s.match(/[aeiou]/g) || []).length >= 3;
  const hasDoubleLetter = /(.)\1/.test(s);
  const hasForbidden = /ab|cd|pq|xy/.test(s);

  return hasThreeVowels && hasDoubleLetter && !hasForbidden;
}

function isNicePart2(s: string): boolean {
  const hasPair = /(..).*\1/.test(s);
  const hasRepeatWithGap = /(.).\1/.test(s);

  return hasPair && hasRepeatWithGap;
}

async function solvePart1(input: string): Promise<number> {
  return lines(input).filter(isNicePart1).length;
}

async function solvePart2(input: string): Promise<number> {
  return lines(input).filter(isNicePart2).length;
}

async function main() {
  const args = process.argv.slice(2);
  const part = args.includes('--part2') ? 2 : 1;
  const useExample = args.includes('--example');

  const inputFile = useExample ? 'example5.txt' : 'input5.txt';
  const input = await readInput(inputFile);

  if (part === 1) {
    console.log('Part 1:', await solvePart1(input));
  } else {
    console.log('Part 2:', await solvePart2(input));
  }
}

main();
