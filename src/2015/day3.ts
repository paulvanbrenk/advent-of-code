// Advent of Code 2015 - Day 3
import { readFile } from 'fs/promises';
import { join } from 'path';

async function readInput(filename: string): Promise<string> {
  return (await readFile(join(__dirname, filename), 'utf-8')).trim();
}

type Position = { x: number; y: number };

function move(pos: Position, dir: string): Position {
  switch (dir) {
    case '^':
      return { x: pos.x, y: pos.y + 1 };
    case 'v':
      return { x: pos.x, y: pos.y - 1 };
    case '>':
      return { x: pos.x + 1, y: pos.y };
    case '<':
      return { x: pos.x - 1, y: pos.y };
    default:
      return pos;
  }
}

function posKey(pos: Position): string {
  return `${pos.x},${pos.y}`;
}

async function solvePart1(input: string): Promise<number> {
  const visited = new Set<string>();
  let pos: Position = { x: 0, y: 0 };
  visited.add(posKey(pos));

  for (const dir of input) {
    pos = move(pos, dir);
    visited.add(posKey(pos));
  }

  return visited.size;
}

async function solvePart2(input: string): Promise<number> {
  const visited = new Set<string>();
  let santaPos: Position = { x: 0, y: 0 };
  let roboPos: Position = { x: 0, y: 0 };
  visited.add(posKey(santaPos));

  for (let i = 0; i < input.length; i++) {
    const dir = input[i];
    if (i % 2 === 0) {
      santaPos = move(santaPos, dir);
      visited.add(posKey(santaPos));
    } else {
      roboPos = move(roboPos, dir);
      visited.add(posKey(roboPos));
    }
  }

  return visited.size;
}

async function main() {
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
