// Advent of Code 2025 - Day 8
import { readFile } from 'fs/promises';
import { join } from 'path';
import { mapLines } from '../utils/input';
import { euclideanDistance, type Point3D } from '../utils/math';

async function readInput(filename: string): Promise<string> {
  // Note: tsx provides __dirname even in ES modules
  return (await readFile(join(__dirname, filename), 'utf-8')).trim();
}

type Edge = { l: string; r: string; d: number };

function getSortedEdges(inputLines: Point3D[]) {
  const edges: Edge[] = [];
  for (let i = 0; i < inputLines.length; i++) {
    for (let j = i + 1; j < inputLines.length; j++) {
      const left = inputLines[i];
      const right = inputLines[j];
      const d = euclideanDistance(left, right);
      edges.push({ l: left.join(','), r: right.join(','), d });
    }
  }
  edges.sort((l, r) => l.d - r.d);

  return edges;
}

async function solvePart1(
  input: string,
  connections: number,
): Promise<string | number> {
  const inputLines = mapLines(
    input,
    (l) => l.split(',').map(Number) as Point3D,
  );

  const edges = getSortedEdges(inputLines);

  let groups: Array<Set<string>> = [];

  for (let i = 0; i < connections; i++) {
    const { l, r } = edges[i];

    const set = groups
      .filter((s) => s.has(l) || s.has(r))
      .reduce((a, c) => a.union(c), new Set<string>());

    set.add(l);
    set.add(r);

    groups = groups.filter((s) => !s.has(l) && !s.has(r));
    groups.push(set);
  }

  groups.sort((l, r) => r.size - l.size);

  return groups[0].size * groups[1].size * groups[2].size;
}

async function solvePart2(input: string): Promise<string | number> {
  const inputLines = mapLines(
    input,
    (l) => l.split(',').map(Number) as Point3D,
  );

  const edges = getSortedEdges(inputLines);

  let groups: Array<Set<string>> = [];
  let output = 0;

  for (let i = 0; i < edges.length; i++) {
    const { l, r } = edges[i];

    const set = groups
      .filter((s) => s.has(l) || s.has(r))
      .reduce((a, c) => a.union(c), new Set<string>());

    set.add(l);
    set.add(r);

    if (set.size == inputLines.length) {
      output = Number(l.split(',')[0]) * Number(r.split(',')[0]);
      break;
    }

    groups = groups.filter((s) => !s.has(l) && !s.has(r));
    groups.push(set);
  }

  return output;
}

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const part = args.includes('--part2') ? 2 : 1;
  const useExample = args.includes('--example');

  const inputFile = useExample ? 'example8.txt' : 'input8.txt';
  const input = await readInput(inputFile);

  if (part === 1) {
    console.log('Part 1:', await solvePart1(input, useExample ? 10 : 1000));
  } else {
    console.log('Part 2:', await solvePart2(input));
  }
}

main();
