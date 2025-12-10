// Advent of Code 2025 - Day 10
import { readFile } from 'fs/promises';
import { join } from 'path';
import { lines } from '../utils/input';
import { minNonNegativeIntegerSolution } from '../utils/math';

async function readInput(filename: string): Promise<string> {
  // Note: tsx provides __dirname even in ES modules
  return (await readFile(join(__dirname, filename), 'utf-8')).trim();
}

type Input = {
  result: string;
  buttons: number[][];
  joltage: number[];
};

function parseInputs(input: string): Input[] {
  const inputLines = lines(input);

  const inputs = inputLines.map((l) => {
    const items = l.split(' ');
    const result = items[0].slice(1, -1);
    const buttons: number[][] = [];
    for (let i = 1; i < items.length - 1; i++) {
      const row = items[i].slice(1, -1);
      const btn = row.split(',').map(Number);
      buttons.push(btn);
    }
    const joltage = items.at(-1)!.slice(1, -1).split(',').map(Number);

    return { result, buttons, joltage } as Input;
  });

  return inputs;
}

function findSeq(input: Input): number {
  const flip = (s: string) => (s === '#' ? '.' : '#');

  const { result, buttons } = input;

  const start = '.'.repeat(result.length);

  const q = buttons.map((_, idx) => ({ state: start, step: 0, idx }));

  const seen = new Set<string>(start);

  while (q.length > 0) {
    const { state, step, idx } = q.splice(0, 1)[0];
    if (state === result) {
      return step;
    }

    const next = buttons[idx]
      .reduce((a, c) => {
        a[c] = flip(a[c]);
        return a;
      }, state.split(''))
      .join('');

    // not seen yet
    if (!seen.has(next)) {
      seen.add(next);
      for (let i = 0; i < buttons.length; i++) {
        q.push({ state: next, step: step + 1, idx: i });
      }
    }
  }

  return -1;
}

function findJoltage(input: Input): number {
  const { joltage, buttons } = input;
  const numButtons = buttons.length;
  const numCounters = joltage.length;

  // Build augmented matrix [A | b] where A*x = b
  // Each row is a counter, each column is a button
  const matrix: number[][] = [];
  for (let r = 0; r < numCounters; r++) {
    const row: number[] = [];
    for (let c = 0; c < numButtons; c++) {
      row.push(buttons[c].includes(r) ? 1 : 0);
    }
    row.push(joltage[r]);
    matrix.push(row);
  }

  // Use the utility to find minimum non-negative integer solution
  return minNonNegativeIntegerSolution(matrix, (freeCol) =>
    Math.min(...buttons[freeCol].map((c) => joltage[c])),
  );
}

async function solvePart1(input: string): Promise<string | number> {
  const inputs = parseInputs(input);

  let result = 0;

  for (const i of inputs) {
    const cnt = findSeq(i);
    result += cnt;
  }

  return result;
}

async function solvePart2(input: string): Promise<string | number> {
  const inputs = parseInputs(input);

  let result = 0;

  for (const i of inputs) {
    const cnt = findJoltage(i);
    console.log(JSON.stringify({ i, cnt }));
    result += cnt;
  }

  return result;
}

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const part = args.includes('--part2') ? 2 : 1;
  const useExample = args.includes('--example');

  const inputFile = useExample ? 'example10.txt' : 'input10.txt';
  const input = await readInput(inputFile);

  if (part === 1) {
    console.log('Part 1:', await solvePart1(input));
  } else {
    console.log('Part 2:', await solvePart2(input));
  }
}

main();
