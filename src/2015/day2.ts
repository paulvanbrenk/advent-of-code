// Advent of Code 2015 - Day 2
import { readFile } from 'fs/promises';
import { join } from 'path';
import { lines } from '../utils/input';

async function readInput(filename: string): Promise<string> {
  return (await readFile(join(__dirname, filename), 'utf-8')).trim();
}

function parseDimensions(line: string): [number, number, number] {
  const [l, w, h] = line.split('x').map(Number);
  return [l, w, h];
}

async function solvePart1(input: string): Promise<number> {
  const inputLines = lines(input);
  let totalPaper = 0;

  for (const line of inputLines) {
    const [l, w, h] = parseDimensions(line);
    const side1 = l * w;
    const side2 = w * h;
    const side3 = h * l;
    const surfaceArea = 2 * side1 + 2 * side2 + 2 * side3;
    const slack = Math.min(side1, side2, side3);
    totalPaper += surfaceArea + slack;
  }

  return totalPaper;
}

async function solvePart2(input: string): Promise<number> {
  const inputLines = lines(input);
  let totalRibbon = 0;

  for (const line of inputLines) {
    const dims = parseDimensions(line);
    dims.sort((a, b) => a - b);
    const [smallest, medium] = dims;
    const smallestPerimeter = 2 * smallest + 2 * medium;
    const volume = dims[0] * dims[1] * dims[2];
    totalRibbon += smallestPerimeter + volume;
  }

  return totalRibbon;
}

async function main() {
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
