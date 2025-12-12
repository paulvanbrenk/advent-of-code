// Advent of Code 2025 - Day 12
import { readFile } from 'fs/promises';
import { join } from 'path';
import { groups } from '../utils/input';

async function readInput(filename: string): Promise<string> {
  // Note: tsx provides __dirname even in ES modules
  return (await readFile(join(__dirname, filename), 'utf-8')).trim();
}

type Tree = { x: number; y: number; gifts: number[] };

async function solvePart1(input: string): Promise<string | number> {
  const groupsInput = groups(input).map((g) => g.split('\n'));

  const shapes: Array<{ shape: string[][]; area: number }> = [];
  const trees: Tree[] = [];

  for (let grp of groupsInput) {
    const l1 = grp[0];
    // tree line
    if (l1.includes('x')) {
      grp.forEach((l) => {
        const [left, right] = l.split(':');
        const [x, y] = left.split('x').map(Number);
        const gifts = right.trim().split(' ').map(Number);
        trees.push({ x, y, gifts });
      });
      continue;
    }

    // idx is only a single digit
    const idx = Number(grp[0][0]);
    const grid = grp.slice(1);
    const shape = grid.map((r) => r.split(''));
    const area = grid.reduce(
      (a, c) =>
        a + c.split('').reduce((a1, c2) => (c2 === '#' ? a1 + 1 : a1), 0),
      0,
    );
    shapes[idx] = { shape, area };
  }

  let cnt = 0;

  // no need for a packing algorithm, allthough the example does need it
  for (let t of trees) {
    const available = t.x * t.y;

    let needed = t.gifts.reduce((a, c, i) => a + c * shapes[i].area, 0);
    if (needed <= available) {
      cnt++;
    }
  }

  return cnt;
}

async function solvePart2(_input: string): Promise<string | number> {
  // No part 2 for the last day
  return 0;
}

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const part = args.includes('--part2') ? 2 : 1;
  const useExample = args.includes('--example');

  const inputFile = useExample ? 'example12.txt' : 'input12.txt';
  const input = await readInput(inputFile);

  if (part === 1) {
    console.log('Part 1:', await solvePart1(input));
  } else {
    console.log('Part 2:', await solvePart2(input));
  }
}

main();
