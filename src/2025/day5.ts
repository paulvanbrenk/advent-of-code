// Advent of Code 2025 - Day 5
import { readFile } from 'fs/promises';
import { join } from 'path';
import { groups, mapLines } from '../utils/input';

async function readInput(filename: string): Promise<string> {
  // Note: tsx provides __dirname even in ES modules
  return (await readFile(join(__dirname, filename), 'utf-8')).trim();
}

function genRanges(rangesStr: string): number[][] {
  const ranges = mapLines(rangesStr, (l) => {
    const [left, right] = l.split('-');
    return [Number(left), Number(right)];
  }).toSorted((l, r) => l[0] - r[0]);

  // merge ranges
  const newRanges = [];
  let start = ranges[0][0];
  let end = ranges[0][1];
  for (let i = 1; i < ranges.length; i++) {
    const [s, e] = ranges[i];
    if (s > end) {
      // start of a new block
      newRanges.push([start, end]);
      start = s;
      end = e;
      continue;
    }

    //
    if (s <= end) {
      end = Math.max(end, e);
    }
  }
  newRanges.push([start, end]);

  return newRanges;
}

async function solvePart1(input: string): Promise<string | number> {
  const [rangesStr, availableStr] = groups(input);

  const availableIds = mapLines(availableStr, Number).toSorted((x, y) => x - y);

  const newRanges = genRanges(rangesStr);

  let cnt = 0;

  let rangeIdx = 0;
  for (let id of availableIds) {
    while (rangeIdx < newRanges.length) {
      const [s, e] = newRanges[rangeIdx];
      if (id < s) {
        break;
      }
      if (id <= e) {
        cnt++;
        break;
      }
      rangeIdx++;
    }
  }

  return cnt;
}

async function solvePart2(input: string): Promise<string | number> {
  const [rangesStr] = groups(input);

  const newRanges = genRanges(rangesStr);

  const cnt = newRanges.reduce((a, c) => {
    return a + (c[1] - c[0]) + 1;
  }, 0);

  return cnt;
}

async function main() {
  // Parse command line arguments
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
